import {
  Await,
  useLoaderData,
  useSearchParams,
  useLocation,
  useNavigation,
  useMatches,
} from '@remix-run/react';

import {Link} from '~/components';

import type {LoaderArgs} from '@remix-run/node';

import {Global, GlobalProduct} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';
import invariant from 'tiny-invariant';
import {seoPayload} from '~/lib/seo.server';
import {defer} from '@shopify/remix-oxygen';

import {Trigger} from '@sledge-app/react-wishlist';

import {AnalyticsPageType, Image, parseGid} from '@shopify/hydrogen';
import {Suspense, useContext, useMemo, useState} from 'react';
import {Skeleton} from '~/components/Global/Skeleton';

import {Rating, Widget as ReviewWidget} from '@sledge-app/react-product-review';

import dummyProducts from '~/data/products.json';
import {HydrogenContext} from '~/components/Global/HydrogenProvider';

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderArgs) {
  const {id} = params;

  const searchParams = new URL(request.url).searchParams;

  const selectedOptions: any = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: id,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const recommended: any = getRecommendedProducts(context, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer(
    {
      product,
      shop,
      storeDomain: shop.primaryDomain.url,
      recommended,
      analytics: {
        pageType: AnalyticsPageType.product,
        resourceId: product.id,
        products: [productAnalytics],
        totalValue: parseFloat(selectedVariant.price.amount),
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

const accordions = [
  {
    title: 'Materials',
    description:
      'Eu aliquam lectus mattis eget in enim vel. Commodo velit nibh pulvinar suspendisse scelerisque sagittis tempor.',
  },
  {
    title: 'Shipping & Returns',
    description:
      'Eu aliquam lectus mattis eget in enim vel. Commodo velit nibh pulvinar suspendisse scelerisque sagittis tempor.',
  },
  {
    title: 'Dimensions',
    description:
      'Eu aliquam lectus mattis eget in enim vel. Commodo velit nibh pulvinar suspendisse scelerisque sagittis tempor.',
  },
  {
    title: 'Care Instructions',
    description:
      'Eu aliquam lectus mattis eget in enim vel. Commodo velit nibh pulvinar suspendisse scelerisque sagittis tempor.',
  },
  {
    title: 'Share',
    description:
      'Eu aliquam lectus mattis eget in enim vel. Commodo velit nibh pulvinar suspendisse scelerisque sagittis tempor.',
  },
];

export function Accordions({item, index}: any) {
  return (
    <div
      className="pt-[18px] lg:pt-[22px] hover:opacity-75 first:pt-0"
      key={index}
    >
      <details className="group" {...(index === 0 && {open: true})}>
        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
          <h6 className="leading-[21.6px] font-sledge-font-family-2 text-sledge-color-text-primary">
            {item.title}
          </h6>
          <span className="transition group-open:rotate-180">
            <svg
              fill="none"
              height={24}
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width={24}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </summary>
        <p className="break-all mt-[12px] lg:mt-[16px] font-sledge-font-family-1 font-[400] text-sledge-color-text-secondary-1 text-[12px] lg:text-[16px] leading-[25.6px] tracking-[-2%] group-open:animate-fadeIn">
          {item.description}
        </p>
      </details>
    </div>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}: any) {
  const {pathname} = useLocation();
  const isLangPathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLangPathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

function ProductOptions({options, searchParamsWithDefaults}: any) {
  return (
    <>
      {options.map((option: any, index: number) => {
        {
          return (
            option.values.length && (
              <div key={index} className="mt-[24px]">
                <div className="flex items-center justify-between">
                  <h6 className="text-[18px] leading-[21.6px]">
                    {option.name}
                  </h6>
                </div>
                <fieldset className="mt-[14px]">
                  <legend className="sr-only">Choose a {option.name}</legend>
                  <div className="flex flex-wrap gap-[16px]">
                    {option.values.length &&
                      option.values.map((value: any, idx: any) => {
                        const checked =
                          searchParamsWithDefaults.get(option.name) === value;
                        const id = `option-${option.name}-${value}`;

                        const colorStyle = `block w-[30px] h-[30px] rounded-[360px] focus:outline-none cursor-pointer hover:opacity-75 ${
                          checked
                            ? 'border-[1px] border-solid border-[#A4FFA3]'
                            : 'border-[1px] border-solid border-black'
                        }`;

                        const defaultStyle = `${
                          checked
                            ? 'bg-[#A4FFA380] border-[1px] border-solid border-[#11493A]'
                            : ''
                        } cursor-pointer font-sledge-font-family-1 text-[#4B4B4B] lg:text-[16px] leading-[25.6px] tracking-[-2%] bg-sledge-color-grey-4 py-[2px] px-[14px] rounded-[360px] hover:opacity-75`;

                        return (
                          <div key={id} className={id}>
                            <ProductOptionLink
                              optionName={option.name}
                              optionValue={value}
                              searchParams={searchParamsWithDefaults}
                              style={{backgroundColor: value}}
                              className={
                                option.name !== 'Color'
                                  ? defaultStyle
                                  : colorStyle
                              }
                            >
                              {option.name !== 'Color' ? value : ''}
                            </ProductOptionLink>
                          </div>
                        );
                      })}
                  </div>
                </fieldset>
              </div>
            )
          );
        }
      })}
    </>
  );
}

export function ProductForm() {
  const {product, analytics, storeDomain} = useLoaderData();

  const [currentSearchParams] = useSearchParams();
  const transition = useNavigation();

  const [quantity, setQuantity] = useState(1);

  /**
   * We update `searchParams` with in-flight request data from `transition` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    setQuantity(1);
    return transition.location
      ? new URLSearchParams(transition.location.search)
      : currentSearchParams;
  }, [currentSearchParams, transition]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: quantity,
  };

  return (
    <div className="grid gap-10">
      <div className="grid">
        <ProductOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
        />
        {selectedVariant && (
          <div className="grid items-stretch">
            {isOutOfStock ? (
              <span className="py-[17px] px-[73px] max-w-fit mt-[14px] lg:mt-[20px] bg-sledge-color-grey-3 rounded-[12px] font-sledge-font-family-2 font-[700] text-[14px] leading-[14px] tracking-[-2%] text-sledge-color-primary-black hover:opacity-75 cursor-not-allowed">
                Out Of Stock
              </span>
            ) : (
              <>
                <div className="mt-[24px]">
                  <h6 className="text-[18px] leading-[21.6px]">Quantity</h6>
                  <div className="flex gap-[12px] mt-[16px] items-center">
                    <Global.Input
                      type="quantity"
                      label="Quantity"
                      name="quantity"
                      placeholder=""
                      quantityState={quantity}
                      maxQuantity={selectedVariant.quantityAvailable}
                      setQuantityState={setQuantity}
                    />
                    <span className="font-sledge-font-family-1 text-sledge-color-text-secondary-1 font-[400] text-[14px] leading-[22.4px] tracking-[-2%]">
                      Stock: {selectedVariant.quantityAvailable}pcs
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-[8px] mt-[32px]">
                  <GlobalProduct.AddToCartButton
                    lines={[
                      {
                        merchandiseId: selectedVariant.id,
                        quantity: quantity,
                      },
                    ]}
                    className={`p-[14px] border-[1px] border-solid border-[--sledge-color-text-secondary-6] rounded-[12px] hover:opacity-75`}
                    analytics={{
                      products: [productAnalytics],
                      totalValue: parseFloat(productAnalytics.price),
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.83562 1.50022C10.796 1.50022 12.4155 2.99397 12.6152 4.90441L12.6709 4.90507C13.7584 4.90507 15.0806 5.62732 15.5269 7.65307L16.1186 12.2333C16.3309 13.7116 16.0654 14.8973 15.3281 15.7478C14.5946 16.5938 13.4336 17.0416 11.9704 17.0416H5.7094C4.10215 17.0416 2.9824 16.6478 2.28565 15.8386C1.5859 15.0271 1.3519 13.8098 1.5904 12.2213L2.1724 7.70182C2.5549 5.62957 3.95365 4.90507 5.03665 4.90507C5.13014 4.04293 5.51889 3.22275 6.13562 2.60797C6.84437 1.90372 7.82162 1.50022 8.81987 1.50022H8.83562ZM12.6709 6.03007H5.03665C4.7059 6.03007 3.6004 6.16357 3.28315 7.87657L2.70415 12.3766C2.5159 13.6388 2.6614 14.5523 3.13765 15.1051C3.6079 15.6511 4.4494 15.9166 5.7094 15.9166H11.9704C12.7564 15.9166 13.8296 15.7598 14.4776 15.0113C14.9921 14.4181 15.1691 13.5346 15.0041 12.3848L14.4199 7.84582C14.1709 6.72757 13.5139 6.03007 12.6709 6.03007ZM11.023 8.11814C11.3335 8.11814 11.6027 8.37014 11.6027 8.68064C11.6027 8.99114 11.368 9.24314 11.0575 9.24314H11.023C10.7125 9.24314 10.4605 8.99114 10.4605 8.68064C10.4605 8.37014 10.7125 8.11814 11.023 8.11814ZM6.65042 8.11814C6.96092 8.11814 7.23017 8.37014 7.23017 8.68064C7.23017 8.99114 6.99467 9.24314 6.68417 9.24314H6.65042C6.33992 9.24314 6.08792 8.99114 6.08792 8.68064C6.08792 8.37014 6.33992 8.11814 6.65042 8.11814ZM8.83337 2.62522H8.82212C8.11637 2.62522 7.42862 2.90947 6.92987 3.40522C6.5236 3.80967 6.25789 4.34137 6.17193 4.90472L11.4814 4.90493C11.2887 3.61625 10.1743 2.62522 8.83337 2.62522Z"
                        fill="#6A6A6A"
                      />
                    </svg>
                  </GlobalProduct.AddToCartButton>
                  <a
                    href={`${storeDomain}/cart/${
                      parseGid(selectedVariant.id).id
                    }:${quantity}`}
                    target={'_blank'}
                    className="py-[17px] px-[73px] max-w-[215px] bg-[--sledge-color-primary-green-4] rounded-[12px] font-sledge-font-family-2 font-[700] text-[14px] leading-[14px] tracking-[-2%] text-sledge-color-primary-black hover:opacity-75"
                  >
                    <span>Buy It Now!</span>
                  </a>
                </div>
              </>
            )}
            {/* {!isOutOfStock && (
              <ShopPayButton
                className="flex"
                variantIds={[selectedVariant?.id]}
                storeDomain={storeDomain}
              />
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Product() {
  const {product, shop, storeDomain, recommended, selectedVariant} =
    useLoaderData();
  let {
    id,
    media,
    title,
    featuredImage,
    vendor,
    description,
    variants,
    options,
  } = product;

  const {shippingPolicy, refundPolicy} = shop;

  const [root] = useMatches();

  const {useDummyData} = useContext(HydrogenContext);

  const dummyImage =
    'https://cdn.shopify.com/s/files/1/0672/5520/6191/files/pdp-featured.png?v=1688746746';
  const dummyChildImage =
    'https://cdn.shopify.com/s/files/1/0672/5520/6191/files/pdp-child.png?v=1688746746';

  if (useDummyData) {
    // dummy title
    title = 'Hoodie | Classic Green | New Collections';
    //dummy description
    description =
      'Gravida nec pellentesque urna semper orci sit eu quisque in. Senectus id augue enim scelerisque nunc amet dictum. Amet amet diam tellus eget id phasellus. Posuere mi justo malesuada nunc interdum nec vitae. Lacus montes imperdiet magna cras.';
    // dummy price
    variants.nodes[0].price.currencyCode = '$';
    variants.nodes[0].price.amount = '67.00';
    variants.nodes[0].price.compareAtPrice = {
      currencyCode: '$',
      amount: '145.00',
    };
    // dummy images
    featuredImage.url = dummyImage;
    media.nodes.map((m: any) => {
      m.image.url = dummyChildImage;
    });
  }

  return (
    <div className="container">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-[30px] pt-10">
        {/* Image gallery */}
        <div className="flex flex-col-reverse col-span-7">
          {/* Image selector */}
          <div className="mx-auto mt-[16px] lg:mt-[36px] w-full max-w-2xl block lg:max-w-none">
            <div
              className="flex overflow-x-auto grid-cols-3 gap-[20px] lg:gap-x-[calc(37px-2px)]"
              aria-orientation="horizontal"
              role="tablist"
            >
              {media.nodes.length &&
                media.nodes.map((item: any, index: number) => {
                  const {image} = item;
                  return (
                    <button
                      id={`tabs-${index}-panel-${index}`}
                      key={index}
                      className="relative flex-none flex h-[100px] lg:h-[224px] w-[100px] lg:w-[223px] cursor-pointer rounded-[16px] bg-sledge-color-grey-4 hover:opacity-75"
                      aria-controls={`tabs-${index}-panel-${index}`}
                      role="tab"
                      type="button"
                    >
                      <span className="sr-only">Angled view</span>
                      <span className="absolute inset-0 overflow-hidden flex justify-center items-center">
                        <Image
                          src={image.url}
                          width={'143px'}
                          height={'143px'}
                          alt={title}
                          className="h-full w-full max-w-[143px] max-h-[143px] object-cover object-center"
                        />
                      </span>
                      {/* Selected: "ring-indigo-500", Not Selected: "ring-transparent" */}
                      <span
                        className="ring-transparent pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
            </div>
          </div>
          <div className="relative aspect-h-1 aspect-w-1 w-full">
            {/* Tab panel, show/hide based on tab state. */}
            <Trigger
              data={{
                productId: parseGid(product.id).id,
                productVariantId: parseGid(product.variants.nodes[0].id).id,
                productName: title,
                productVendor: product.vendor,
                productSku: product.variants.nodes[0].sku,
                productVariantName: `${product.variants.nodes[0].selectedOptions[0].value} / ${product.variants.nodes[0].selectedOptions[1].value}`,
                productLink: `https://dev-learn-apps.myshopify.com/products/${product.handle}`,
                productImage: featuredImage?.url,
                productCurrency: variants.nodes[0].price.currencyCode,
                productPrice: variants.nodes[0].price.amount,
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
            />
            <div
              id="tabs-1-panel-1"
              aria-labelledby="tabs-1-tab-1"
              role="tabpanel"
              tabIndex={0}
              className="flex justify-center items-center bg-sledge-color-grey-4 rounded-[32px] h-auto lg:h-[740px]"
            >
              <Image
                src={featuredImage.url}
                width={'620'}
                height={'620'}
                alt={title}
                className="h-full w-full max-w-[620px] max-h-[620px] object-cover object-center"
              />
            </div>
          </div>
        </div>
        {/* Product info */}
        <div className="mt-7 sm:mt-16 lg:mt-0 col-span-5">
          <h2 className="max-w-[480px] leading-[30px] lg:leading-[48px]">
            {title}
          </h2>
          {/* Reviews */}
          <div className="mt-[12px] lg:mt-[16px]">
            <h3 className="sr-only">Reviews</h3>
            <Rating
              data={{
                productId: parseGid(id).id,
              }}
              size="md"
            />
          </div>
          <div className="mt-[18px] lg:mt-[24px]">
            <div className="max-w-[480px]">
              <h2 className="sr-only">Description</h2>
              <p className="font-sledge-font-family-1 font-[400] text-[14px] text-sledge-color-text-secondary-1 lg:text-[16px] leading-[25.6px] tracking-[-2%]">
                {description}
              </p>
            </div>
          </div>
          <div className="mt-[18px] lg:mt-[24px] flex items-center gap-[12px]">
            <h2 className="sr-only">Product information</h2>
            <p className="font-sledge-font-family-2 font-[700] text-sledge-color-text-primary text-[26px] lg:text-[32px] leading-normal lg:leading-[38.4px]">
              {variants.nodes[0].price.currencyCode}
              {variants.nodes[0].price.amount.split('.')[0]}
              <span className="text-[20px]">
                {'.' + variants.nodes[0].price.amount.split('.')[1]}
              </span>
            </p>
            <span className="font-sledge-font-family-1 line-through font-[400] text-[#FF7373] text-[12px] lg:text-[16px] leading-[25.6px] tracking-[-2%]">
              {(variants.nodes[0].price.compareAtPrice &&
                variants.nodes[0].price.compareAtPrice.currencyCode) ||
                ''}
              {variants.nodes[0].price.compareAtPrice?.amount}
            </span>
          </div>
          <ProductForm />
          <section
            aria-labelledby="details-heading"
            className="mt-[20px] lg:mt-[40px]"
          >
            {accordions.map((item, index) => {
              return <Accordions item={item} index={index} key={index} />;
            })}
          </section>
        </div>
      </div>
      <div>
        <ReviewWidget.Root
          data={{
            productId: parseGid(id).id,
            productVariantId: parseGid(selectedVariant?.id)?.id,
          }}
          onAfterAddReview={(state) => {
            if (state === 'success') {
              console.log('%cSledge', consoleStyle, `Add review: ${state}`);
            } else {
              console.error('%cSledge', consoleStyle, `Add review: ${state}`);
            }
          }}
        >
          <ReviewWidget.Header>
            <ReviewWidget.Header.Summary />
            <ReviewWidget.Header.AddTrigger />
            <ReviewWidget.Header.Sort />
          </ReviewWidget.Header>
          <ReviewWidget.List />
        </ReviewWidget.Root>
      </div>
      <div className="gap-[36px] flex flex-col mt-[12px]">
        <h4 className="font-normal">You may also like</h4>
        <div className="flex overflow-scroll gap-x-[30px] mb-[60px] lg:mb-[120px]">
          <Suspense fallback={<Skeleton type={'productCard'} />}>
            <Await resolve={recommended}>
              {(products) =>
                products &&
                products.map((product: any, index: number) => {
                  return (
                    <GlobalProduct.ProductCard
                      dummyData={dummyProducts[index]}
                      product={product}
                      key={index}
                      className={'shrink-0 w-[300px]'}
                    />
                  );
                })
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      featuredImage {
        id
        url
        width
        height
      }
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

async function getRecommendedProducts(context: any, productId: string) {
  const products = await context.storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value: any, index: number, array: any) =>
        array.findIndex((value2: any) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item: any) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  if (Boolean(Number(context.env.USE_DUMMY_DATA)))
    return mergedProducts.slice(1, 6);

  return mergedProducts;
}
