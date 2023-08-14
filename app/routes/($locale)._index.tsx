import {Suspense} from 'react';
import {defer, json} from '@shopify/remix-oxygen';
import {Await, Form, useLoaderData, useFetcher} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

import {GlobalProduct} from '~/components';
import {LandingPage} from '~/components/LandingPage';
import {SortBy} from '~/components/Global/Sort';
import {Skeleton} from '~/components/Global/Skeleton';

import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';

export const headers = routeHeaders;

export async function loader({params, request, context}: any) {
  const {language, country} = context.storefront.i18n;

  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );

  if (
    params.lang &&
    params.lang.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the lang URL param is defined, yet we still are on `EN-US`
    // the the lang param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'vans'},
  });

  const seo = seoPayload.home();

  return defer(
    {
      shop,
      primaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
        variables: {
          handle: 'vans',
          country,
          language,
        },
      }),
      newProducts: context.storefront.query(HOMEPAGE_NEW_PRODUCTS_QUERY, {
        variables: {
          sortKey,
          reverse,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      }),
      brandImages: context.storefront.query(BRAND_IMAGES, {
        variables: {
          country,
          language,
        },
      }),
      secondaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
        variables: {
          handle: 'adidas',
          country,
          language,
        },
      }),
      analytics: {
        pageType: AnalyticsPageType.home,
      },
      seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}

export default function Index() {
  const {primaryHero, newProducts, brandImages, secondaryHero} =
    useLoaderData();

  return (
    <div className="homepage">
      {primaryHero && (
        <Suspense>
          <Await resolve={primaryHero}>
            {({hero}) => {
              return !hero ? null : (
                <LandingPage.Hero
                  className="mt-[4px]"
                  data={hero}
                  imagePosition={'right'}
                  title={{
                    color: 'text-sledge-color-primary-green-5',
                  }}
                  description={{
                    color: 'text-sledge-color-text-secondary-1',
                  }}
                  bgColor="bg-sledge-color-primary-green-4"
                  button={{
                    textColor: 'text-white',
                    bgColor: 'bg-sledge-color-primary-green-3',
                  }}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {newProducts && (
        <Suspense
          fallback={
            <div className="container my-[20px]">
              <Skeleton type={'productCard'} />
            </div>
          }
        >
          <Await resolve={newProducts}>
            {({products}) => {
              return !products ? null : (
                <>
                  <div className="container flex justify-end mt-[30px] lg:mt-[58px]">
                    <SortBy />
                  </div>
                  <GlobalProduct.ProductLists
                    products={products.nodes}
                    title="New Product"
                  />
                </>
              );
            }}
          </Await>
        </Suspense>
      )}

      {brandImages && (
        <Suspense>
          <Await resolve={brandImages}>
            {({metaobjects}) => {
              return !metaobjects ? null : (
                <LandingPage.OurBrand data={metaobjects.nodes[0]} />
              );
            }}
          </Await>
        </Suspense>
      )}

      {secondaryHero && (
        <Suspense>
          <Await resolve={secondaryHero}>
            {({hero}) => {
              return !hero ? null : (
                <LandingPage.Hero
                  className="mt-[80px] mb-0"
                  data={hero}
                  imagePosition={'left'}
                  title={{
                    color: 'text-white',
                  }}
                  description={{
                    color: 'text-[#B3B3B3]',
                  }}
                  bgColor="bg-sledge-color-primary-green-3"
                  button={{
                    textColor: 'text-black',
                    bgColor: 'bg-white',
                  }}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      <LandingPage.NewCollection />
      <LandingPage.SubscribeForm />
    </div>
  );
}

function CollectionContentFragment() {
  const COLLECTION_CONTENT_FRAGMENT = `#graphql
    ${MEDIA_FRAGMENT}
    fragment CollectionContent on Collection {
      id
      handle
      title
      descriptionHtml
      heroTitle: metafield(namespace: "custom", key: "hero_title") {
        value
      }
      heroDescription: metafield(namespace: "custom", key: "hero_description") {
        value
      }
      heroImage: metafield(namespace: "custom", key: "hero_image") {
        reference {
          ...Media
        }
      }
      heroButtonCtaText: metafield(namespace: "custom", key: "hero_button_cta_text") {
        value
      }
    }
  `;

  return COLLECTION_CONTENT_FRAGMENT;
}

export const COLLECTION_HERO_QUERY = `#graphql
  ${CollectionContentFragment()}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
  }
`;

export const HOMEPAGE_SEO_QUERY = `#graphql
  ${CollectionContentFragment()}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
`;

export const HOMEPAGE_NEW_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query homepageNewProducts($sortKey: ProductSortKeys,$reverse: Boolean, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(
      sortKey:$sortKey 
      first: 8
      reverse: $reverse
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

export const BRAND_IMAGES = `#graphql
  query homepageBrandImages($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language){
    metaobjects(type: "landing_page", first: 10) {
      nodes {
        handle
        type
        brand_top: field(key: "brands_top") {
          references(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  image {
                    url
                    width
                    height
                  }
                }
              }
            }
          }
        }
        brand_bottom: field(key: "brands_bottom") {
          references(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  image {
                    url
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;

type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED_AT',
        reverse: false,
      };
    case 'featured':
      return {
        sortKey: 'UPDATED_AT',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
