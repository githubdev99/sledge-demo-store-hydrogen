/*
  Cart Queries
*/

export const USER_ERROR_FRAGMENT = `#graphql
  fragment ErrorFragment on CartUserError {
    message
    field
    code
  }
`;

export const LINES_CART_FRAGMENT = `#graphql
  fragment CartLinesFragment on Cart {
    id
    totalQuantity
  }
`;

//! @see: https://shopify.dev/api/storefront/2022-01/mutations/cartcreate
export const CREATE_CART_MUTATION = `#graphql
  mutation ($input: CartInput!, $country: CountryCode = ZZ, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
`;

export const ADD_LINES_MUTATION = `#graphql
mutation ($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode = ZZ, $language: LanguageCode)
@inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
        ...CartLinesFragment
    }
    errors: userErrors {
        ...ErrorFragment
    }
    }
}
${LINES_CART_FRAGMENT}
${USER_ERROR_FRAGMENT}
`;

export const REMOVE_LINE_ITEMS_MUTATION = `#graphql
  mutation ($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode)
  @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ...on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
      errors: userErrors {
        message
        field
        code
      }
    }
  }
`;

export const LINES_UPDATE_MUTATION = `#graphql
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode)
  @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`;

export const UPDATE_CART_BUYER_COUNTRY = `#graphql
 mutation(
   $cartId: ID!
   $buyerIdentity: CartBuyerIdentityInput!
   $country: CountryCode = ZZ
   $language: LanguageCode
 ) @inContext(country: $country, language: $language) {
   cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
     cart {
       id
       buyerIdentity {
         email
         phone
         countryCode
       }
     }
     errors: userErrors {
       message
       field
       code
     }
   }
 }
`;

export const DISCOUNT_CODES_UPDATE = `#graphql
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $country: CountryCode = ZZ)
    @inContext(country: $country) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes {
          code
        }
      }
      errors: userErrors {
        field
        message
      }
    }
  }
`;
