import {useLoaderData} from '@remix-run/react';
import {json, type LoaderArgs, type MetaFunction} from '@shopify/remix-oxygen';

import {GlobalProduct, Pages} from '~/components';
import invariant from 'tiny-invariant';
import {seoPayload} from '~/lib/seo.server';

import {routeHeaders} from '~/data/cache';
import {SearchResultWidget} from '@sledge-app/react-instant-search';

import {Widget as WishlistWidget} from '@sledge-app/react-wishlist';
import {CustomComponents} from '@sledge-app/core';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderArgs) {
  const {pageHandle} = params;
  invariant(params.pageHandle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: pageHandle || '',
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const pages = ['wishlist', 'contact', 'search-result'];
  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo, pages, pageHandle});
}

export function DynamicPages({pageHandle, page}: any) {
  switch (pageHandle) {
    case 'wishlist':
      return (
        <div className="container pt-[1.9rem] pb-[120px]">
          <Wishlist />
        </div>
      );
    case 'contact':
      return (
        <div className="container pt-[1.9rem] pb-[120px]">
          <Pages.Contact />
        </div>
      );
    case 'search-result':
      return (
        <div className="pb-[33px] max-w-[1335px] mx-auto min-h-screen">
          <SearchResult />
        </div>
      );
    default:
      return (
        <div>
          <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
            <img
              src="https://images.unsplash.com/photo-1581084324492-c8076f130f86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt={'Page Header'}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
              className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
              aria-hidden="true"
            >
              <div
                className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <div
              className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
              aria-hidden="true"
            >
              <div
                className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <div className="mx-auto px-6 lg:px-8">
              <div className="mx-auto">
                <h2 className="text-white text-center">{page?.title}</h2>
              </div>
            </div>
          </div>
          <div
            className="container my-8"
            dangerouslySetInnerHTML={{__html: page?.body}}
          />
        </div>
      );
  }
}

export default function PagesIndexId() {
  const data = useLoaderData();
  const {pageHandle, page} = data;

  return <DynamicPages pageHandle={pageHandle} page={page} />;
}

export function CatchBoundary() {
  return <h1>Page Not Found</h1>;
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export function Wishlist() {
  return (
    <WishlistWidget.Root
      customShareLink="/pages/wishlist"
      query={{
        shareId: 'share',
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
          console.error('%cSledge', consoleStyle, `Add to wishlist: ${state}`);
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
  );
}

export function SearchResult() {
  return (
    <SearchResultWidget
      query={{
        keyword: 'q',
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
          console.error('%cSledge', consoleStyle, `Add to wishlist: ${state}`);
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
      <CustomComponents
        productCard={GlobalProduct.SledgeProductCard}
        wishlistWidgetAlert={GlobalProduct.SledgeWishlistWidgetAlert}
      />
    </SearchResultWidget>
  );
}
