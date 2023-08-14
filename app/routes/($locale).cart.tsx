import {
  json,
  type ActionArgs,
  type AppLoadContext,
} from '@shopify/remix-oxygen';

import type {
  Cart as CartType,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartUserError,
  UserError,
  CartBuyerIdentityInput,
} from '@shopify/hydrogen/storefront-api-types';

import {CartAction, type CartActions} from '~/lib/type';

import {Await, useMatches} from '@remix-run/react';

import {isLocalPath, getCartId} from '~/lib/utils';

import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import {CartComponents} from '~/components';

import {
  CREATE_CART_MUTATION,
  ADD_LINES_MUTATION,
  REMOVE_LINE_ITEMS_MUTATION,
  LINES_UPDATE_MUTATION,
  UPDATE_CART_BUYER_COUNTRY,
  DISCOUNT_CODES_UPDATE,
} from '~/data/queries/cart';

export async function action({request, context}: ActionArgs) {
  const {session, storefront} = context;
  const headers = new Headers();
  let cartId = getCartId(request);

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const cartAction = formData.get('cartAction') as CartActions;
  invariant(cartAction, 'No cartAction defined');

  const countryCode = formData.get('countryCode')
    ? (formData.get('countryCode') as CartBuyerIdentityInput['countryCode'])
    : null;

  let status = 200;
  let result: {
    cart: CartType;
    errors?: CartUserError[] | UserError[];
  };

  switch (cartAction) {
    case CartAction.ADD_TO_CART:
      const lines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineInput[])
        : ([] as CartLineInput[]);
      invariant(lines.length, 'No lines to add');

      /**
       * If no previous cart exists, create one with the lines.
       */
      if (!cartId) {
        result = await cartCreate({
          input: countryCode ? {lines, buyerIdentity: {countryCode}} : {lines},
          storefront,
        });
      } else {
        result = await cartAdd({
          cartId,
          lines,
          storefront,
        });
      }

      cartId = result.cart.id;

      break;
    case CartAction.REMOVE_FROM_CART:
      invariant(cartId, 'Missing cartId');
      const lineIds = formData.get('linesIds')
        ? (JSON.parse(String(formData.get('linesIds'))) as CartType['id'][])
        : ([] as CartType['id'][]);
      invariant(lineIds.length, 'No lines to remove');

      result = await cartRemove({
        cartId,
        lineIds,
        storefront,
      });

      cartId = result.cart.id;

      break;
    case CartAction.UPDATE_CART:
      invariant(cartId, 'Missing cartId');
      const updateLines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineUpdateInput[])
        : ([] as CartLineUpdateInput[]);
      invariant(updateLines.length, 'No lines to update');

      result = await cartUpdate({
        cartId,
        lines: updateLines,
        storefront,
      });

      cartId = result.cart.id;

      break;
    case CartAction.UPDATE_DISCOUNT:
      invariant(cartId, 'Missing cartId');

      const formDiscountCode = formData.get('discountCode');
      const discountCodes = ([formDiscountCode] || ['']) as string[];

      result = await cartDiscountCodesUpdate({
        cartId,
        discountCodes,
        storefront,
      });

      cartId = result.cart.id;

      break;
    case CartAction.UPDATE_BUYER_IDENTITY:
      const buyerIdentity = formData.get('buyerIdentity')
        ? (JSON.parse(
            String(formData.get('buyerIdentity')),
          ) as CartBuyerIdentityInput)
        : ({} as CartBuyerIdentityInput);

      result = cartId
        ? await cartUpdateBuyerIdentity({
            cartId,
            buyerIdentity: {
              ...buyerIdentity,
              customerAccessToken,
            },
            storefront,
          })
        : await cartCreate({
            input: {
              buyerIdentity: {
                ...buyerIdentity,
                customerAccessToken,
              },
            },
            storefront,
          });

      cartId = result.cart.id;

      break;
    default:
      invariant(false, `${cartAction} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  headers.append('Set-Cookie', `cart=${cartId.split('/').pop()}`);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart, errors} = result;
  return json(
    {
      cart,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

/**
 * Create a cart with line(s) mutation
 * @param input CartInput https://shopify.dev/api/storefront/2022-01/input-objects/CartInput
 * @see https://shopify.dev/api/storefront/2022-01/mutations/cartcreate
 * @returns result {cart, errors}
 * @preserve
 */

export default function CartRoute() {
  const [root] = useMatches();
  // @todo: finish on a separate PR
  return (
    <div className="container">
      <Suspense fallback={<div>Loading</div>}>
        <Await resolve={root.data?.cart}>
          {(cart) => <CartComponents cart={cart} />}
        </Await>
      </Suspense>
    </div>
  );
}

export async function cartCreate({input, storefront}: any) {
  const {cartCreate} = await storefront.mutate(CREATE_CART_MUTATION, {
    variables: {input},
  });

  invariant(cartCreate, 'No data returned from cartCreate mutation');

  return cartCreate;
}

/**
 * Storefront API cartLinesAdd mutation
 * @param cartId
 * @param lines [CartLineInput!]! https://shopify.dev/api/storefront/2022-01/input-objects/CartLineInput
 * @see https://shopify.dev/api/storefront/2022-01/mutations/cartLinesAdd
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartAdd({cartId, lines, storefront}: any) {
  const {cartLinesAdd} = await storefront.mutate(ADD_LINES_MUTATION, {
    variables: {cartId, lines},
  });

  invariant(cartLinesAdd, 'No data returned from cartLinesAdd mutation');

  return cartLinesAdd;
}

/**
 * Create a cart with line(s) mutation
 * @param cartId the current cart id
 * @param lineIds [ID!]! an array of cart line ids to remove
 * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
 * @returns mutated cart
 * @preserve
 */
export async function cartRemove({cartId, lineIds, storefront}: any) {
  const {cartLinesRemove} = await storefront.mutate(
    REMOVE_LINE_ITEMS_MUTATION,
    {
      variables: {
        cartId,
        lineIds,
      },
    },
  );

  invariant(cartLinesRemove, 'No data returned from remove lines mutation');
  return cartLinesRemove;
}

/**
 * Update cart line(s) mutation
 * @param cartId the current cart id
 * @param lineIds [ID!]! an array of cart line ids to remove
 * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
 * @returns mutated cart
 * @preserve
 */
export async function cartUpdate({cartId, lines, storefront}: any) {
  const {cartLinesUpdate} = await storefront.mutate(LINES_UPDATE_MUTATION, {
    variables: {cartId, lines},
  });

  invariant(
    cartLinesUpdate,
    'No data returned from update lines items mutation',
  );
  return cartLinesUpdate;
}
/**
 * @see https://shopify.dev/api/storefront/2022-10/mutations/cartBuyerIdentityUpdate
 * @preserve
 */

/**
 * Mutation to update a cart buyerIdentity
 * @param cartId  Cart['id']
 * @param buyerIdentity CartBuyerIdentityInput
 * @returns {cart: Cart; errors: UserError[]}
 * @see API https://shopify.dev/api/storefront/2022-10/mutations/cartBuyerIdentityUpdate
 * @preserve
 */
export async function cartUpdateBuyerIdentity({
  cartId,
  buyerIdentity,
  storefront,
}: any) {
  const {cartBuyerIdentityUpdate} = await storefront.mutate(
    UPDATE_CART_BUYER_COUNTRY,
    {
      variables: {
        cartId,
        buyerIdentity,
      },
    },
  );

  invariant(
    cartBuyerIdentityUpdate,
    'No data returned from cart buyer identity update mutation',
  );

  return cartBuyerIdentityUpdate;
}

/**
 * Mutation that updates the cart discounts
 * @param discountCodes Array of discount codes
 * @returns mutated cart
 * @preserve
 */
export async function cartDiscountCodesUpdate({
  cartId,
  discountCodes,
  storefront,
}: any) {
  const {cartDiscountCodesUpdate} = await storefront.mutate(
    DISCOUNT_CODES_UPDATE,
    {
      variables: {
        cartId,
        discountCodes,
      },
    },
  );

  invariant(
    cartDiscountCodesUpdate,
    'No data returned from the cartDiscountCodesUpdate mutation',
  );

  return cartDiscountCodesUpdate;
}
