/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prefer-const */

import {
  defer,
  type LinksFunction,
  type LoaderArgs,
  type AppLoadContext,
} from '@shopify/remix-oxygen';

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';

import invariant from 'tiny-invariant';

import {ShopifySalesChannel, Seo, parseGid} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {DEFAULT_LOCALE, parseMenu, getCartId} from './lib/utils';
import {useAnalytics} from './hooks/useAnalytics';

import styles from './styles/app.css';

import favicon from '../public/favicon.svg';

import {Layout} from '~/components/Layout';

import {GlobalProduct, Pages} from './components';

import {cssBundleHref} from '@remix-run/css-bundle';

import {SledgeProvider, CustomComponents} from '@sledge-app/core';

import {
  WidgetPopup,
  Widget as WishlistWidget,
} from '@sledge-app/react-wishlist';

import '@sledge-app/core/style.css';
import {useState} from 'react';
import {HydrogenProvider} from './components/Global/HydrogenProvider';

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader({request, context}: LoaderArgs) {
  const cartId = getCartId(request);
  const [customerAccessToken, layout] = await Promise.all([
    context.session.get('customerAccessToken'),
    getLayoutData(context),
  ]);

  const seo = seoPayload.root({shop: layout.shop, url: request.url});

  const {storefront} = context;

  const customerVariables = {
    variables: {
      customerAccessToken: '',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  };

  if (Boolean(customerAccessToken)) {
    customerVariables.variables.customerAccessToken = customerAccessToken;
  }

  const {customer} = await storefront.query(CUSTOMER_QUERY, customerVariables);

  return defer({
    isLoggedIn: Boolean(customerAccessToken),
    layout,
    useDummyData: Boolean(Number(context.env.USE_DUMMY_DATA)),
    sledgeApiKey: context.env.SLEDGE_API_KEY,
    sledgeInstantSearchApiKey: context.env.SLEDGE_INSTANT_SEARCH_API_KEY,
    customer,
    selectedLocale: context.storefront.i18n,
    cart: cartId ? getCart(context, cartId) : undefined,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: layout.shop.id,
    },
    seo,
  });
}

export default function App() {
  const data = useLoaderData();

  let {customer, sledgeApiKey, sledgeInstantSearchApiKey, useDummyData} = data;

  const [useDummyDataState, setUseDummyData] = useState(useDummyData);

  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;

  useAnalytics(hasUserConsent, locale);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <HydrogenProvider
          useDummyData={useDummyDataState}
          setUseDummyData={setUseDummyData}
        >
          <SledgeProvider
            apiKey={sledgeApiKey}
            instantSearchApiKey={sledgeInstantSearchApiKey}
            userId={parseGid(customer?.id).id}
            userEmail={customer?.email}
            userFullname={
              customer?.firstName || customer?.lastName
                ? (customer?.firstName ? customer?.firstName + ' ' : '') +
                  (customer?.lastName ? customer?.lastName : '')
                : ''
            }
          >
            <WidgetPopup>
              <WishlistWidget.Root
                customShareLink="/pages/wishlist"
                query={{
                  shareId: 'share',
                }}
                onAfterAddToCart={(state) => {
                  if (state === 'success') {
                    console.log(
                      '%cSledge',
                      consoleStyle,
                      `Add to cart: ${state}`,
                    );
                  } else {
                    console.error(
                      '%cSledge',
                      consoleStyle,
                      `Add to cart: ${state}`,
                    );
                  }
                }}
                onAfterAddWishlist={(state) => {
                  if (state === 'success') {
                    console.log(
                      '%cSledge',
                      consoleStyle,
                      `Add to wishlist: ${state}`,
                    );
                  } else {
                    console.error(
                      '%cSledge',
                      consoleStyle,
                      `Add to wishlist: ${state}`,
                    );
                  }
                }}
                onAfterRemoveWishlist={(state) => {
                  if (state === 'success') {
                    console.log(
                      '%cSledge',
                      consoleStyle,
                      `Remove from wishlist: ${state}`,
                    );
                  } else {
                    console.error(
                      '%cSledge',
                      consoleStyle,
                      `Remove from wishlist: ${state}`,
                    );
                  }
                }}
                onAfterRenderProduct={(state) => {
                  if (state === 'success') {
                    console.log(
                      '%cSledge',
                      consoleStyle,
                      `Render product: ${state}`,
                    );
                  } else {
                    console.error(
                      '%cSledge',
                      consoleStyle,
                      `Render product: ${state}`,
                    );
                  }
                }}
              >
                <CustomComponents
                  productCard={GlobalProduct.SledgeProductCard}
                  wishlistWidgetAlert={GlobalProduct.SledgeWishlistWidgetAlert}
                />

                <WishlistWidget.Header>
                  <WishlistWidget.Header.Title text="My Wishlist" />
                  <WishlistWidget.Header.SearchForm placeholder="Search product" />
                  <WishlistWidget.Header.ClearTrigger buttonText="Clear Wishlist" />
                  <WishlistWidget.Header.ShareTrigger buttonText="Share Wishlist" />
                  <WishlistWidget.Header.Sort />
                  <WishlistWidget.Header.Limit options={[10, 25, 50, 100]} />
                </WishlistWidget.Header>
                <WishlistWidget.List gridType="large" />
              </WishlistWidget.Root>
            </WidgetPopup>
            <Layout
              layout={data.layout}
              key={`${locale.language}-${locale.country}`}
            >
              <Outlet />
            </Layout>
          </SledgeProvider>
        </HydrogenProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const [root] = useMatches();
  const locale = root?.data?.selectedLocale ?? DEFAULT_LOCALE;
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          layout={root?.data?.layout}
          key={`${locale.language}-${locale.country}`}
        >
          {isRouteError ? (
            <>
              {routeError.status === 404 ? (
                <Pages.NotFound type={pageType} />
              ) : (
                <Pages.GenericError
                  error={{message: `${routeError.status} ${routeError.data}`}}
                />
              )}
            </>
          ) : (
            <Pages.GenericError
              error={error instanceof Error ? error : undefined}
            />
          )}
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

async function getLayoutData({storefront}: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes: any = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return {shop: data.shop, headerMenu, footerMenu};
}

const CART_QUERY = `#graphql
  query cartQuery($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              sku
              quantityAvailable
              compareAtPrice {
                ...MoneyFragment
              }
              price {
                ...MoneyFragment
              }
              requiresShipping
              title
              image {
                ...ImageFragment
              }
              product {
                handle
                vendor
                title
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
` as const;

export async function getCart({storefront}: AppLoadContext, cartId: string) {
  invariant(storefront, 'missing storefront client in cart query');

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerDetails
    }
  }

  fragment CustomerDetails on Customer {
    id
    firstName
    lastName
    phone
    email
  }
` as const;
