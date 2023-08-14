import {useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {CustomComponents} from '@sledge-app/core';
import {ProductFilterWidget} from '@sledge-app/react-instant-search';
import {GlobalProduct} from '~/components';

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export async function loader({params, context}: any) {
  const {handle} = params;
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
    },
  });

  // Handle 404s
  if (!collection && handle !== 'all') {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
  });
}

const seo = ({data}: any) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});
export const handle = {
  seo,
};

export default function Collection() {
  const {collection} = useLoaderData();
  return (
    <div className="pb-[33px] max-w-[1335px] mx-auto">
      <ProductFilterWidget
        query={{
          keyword: 'q',
        }}
        data={{
          collectionId: Number(parseGid(collection?.id).id),
        }}
        onAfterAddToCart={(state) => {
          if (state === 'success') {
            console.log('%cSledge', consoleStyle, `Add to cart: ${state}`);
          } else {
            console.error('%cSledge', consoleStyle, `Add to cart: ${state}`);
          }
        }}
        onAfterAddWishlist={(state) => {
          if (state === 'success') {
            console.log('%cSledge', consoleStyle, `Add to wishlist: ${state}`);
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
            console.log('%cSledge', consoleStyle, `Render product: ${state}`);
          } else {
            console.error('%cSledge', consoleStyle, `Render product: ${state}`);
          }
        }}
      >
        <CustomComponents productCard={GlobalProduct.SledgeProductCard} />
      </ProductFilterWidget>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
    }
  }
`;
