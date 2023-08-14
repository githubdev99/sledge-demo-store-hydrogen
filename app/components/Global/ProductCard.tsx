import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {getProductPlaceholder} from '~/lib/placeholders';

import {Link} from '..';
import {parseGid} from '@shopify/hydrogen';
import {GlobalProduct} from '..';

import {Trigger} from '@sledge-app/react-wishlist';

import {Rating} from '@sledge-app/react-product-review';

import {useContext} from 'react';

import {HydrogenContext} from './HydrogenProvider';

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

interface IProductCard {
  product: any;
  dummyData: any;
  className?: string;
}

export function ProductCard({product, dummyData, className}: IProductCard) {
  const {useDummyData} = useContext(HydrogenContext);

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;

  const {image} = firstVariant;

  const isOutOfStock = firstVariant?.availableForSale;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div
      className={`group relative product-card lg:max-w-[300px] ${className}`}
      key={parseGid(product.id).id}
    >
      <div>
        <Trigger
          data={{
            productId: parseGid(product.id).id,
            productVariantId: parseGid(product.variants.nodes[0].id).id,
            productName: product.title,
            productVendor: product.vendor,
            productSku: product.variants.nodes[0].sku,
            productVariantName: `${product.variants.nodes[0].selectedOptions[0].value} / ${product.variants.nodes[0].selectedOptions[1].value}`,
            productLink: `https://dev-learn-apps.myshopify.com/products/${product.handle}`,
            productImage: image?.url,
            productCurrency: product.variants.nodes[0].price.currencyCode,
            productPrice: product.variants.nodes[0].price.amount,
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
        <div className="aspect-h-1 bg-sledge-color-grey-4 aspect-w-1 w-full overflow-hidden rounded-[24px] lg:aspect-none group-hover:opacity-75 lg:max-h-[300px] h-fit lg:h-[300px] flex justify-center items-center">
          {useDummyData ? (
            <Image
              alt="Product Card"
              src={dummyData?.fake_image}
              className="w-[236px] h-[236px]"
              width={'236'}
              height={'236'}
            />
          ) : (
            <img
              src={image?.url}
              alt={'Product Image'}
              className="w-fit h-fit"
            />
          )}
        </div>
        <div className="mt-[18px] lg:mt-[24px] flex justify-between">
          <div className="flex justify-start flex-col">
            <p className="line-clamp-1 text-[16px] lg:text-[20px] font-bold leading-[24px] text-[--sledge-color-primary-black] font-sledge-font-family-2">
              <Link to={'/products/' + product.handle}>
                <span aria-hidden="true" className="absolute inset-0" />
                {useDummyData ? dummyData?.fake_title : product.title}
              </Link>
            </p>
          </div>
          <p className="text-[16px] lg:text-[20px] font-bold leading-[24px] text-[--sledge-color-primary-black] font-sledge-font-family-2">
            {useDummyData
              ? '$' + dummyData?.fake_price
              : product.variants.nodes[0].price.currencyCode +
                product.variants.nodes[0].price.amount}
          </p>
        </div>
        <div className="flex justify-start flex-col">
          <p className="mt-[8px] lg:mt-[12px] mb-[4px] font-sledge-font-family-1 font-[400] text-[12px] lg:text-[14px] leading-[22px] tracking-[ -0.02em]">
            {!useDummyData ? (
              <>
                <span>{product.vendor}</span>{' '}
                {product.variants.nodes[0].sku && (
                  <>
                    | <span>{product.variants.nodes[0].sku}</span>
                  </>
                )}
              </>
            ) : (
              dummyData?.fake_vendor_sku
            )}
          </p>
          <Rating
            data={{
              productId: parseGid(product.id).id,
            }}
            size="sm"
          />
        </div>
      </div>
      {!isOutOfStock ? (
        <span className="relative z-10 inline-flex mt-[16px] items-center py-[11px] px-[16.33px] border-[1px] border-[--sledge-color-text-secondary-6] rounded-[360px] bg-sledge-color-grey-4 text-[--sledge-color-text-secondary-6] cursor-not-allowed">
          Out Of Stock
        </span>
      ) : (
        <div>
          <GlobalProduct.AddToCartButton
            lines={[
              {
                quantity: 1,
                merchandiseId: firstVariant.id,
              },
            ]}
            className={`relative z-10 inline-flex mt-[16px] items-center py-[11px] px-[16.33px] border-[1px] border-[--sledge-color-text-secondary-6] rounded-[360px] bg-white text-[--sledge-color-text-secondary-6] hover:opacity-70 transition duration-200`}
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
                d="M8.83562 1.5C10.796 1.5 12.4155 2.99374 12.6152 4.90419L12.6709 4.90485C13.7584 4.90485 15.0806 5.6271 15.5269 7.65285L16.1186 12.2331C16.3309 13.7113 16.0654 14.8971 15.3281 15.7476C14.5946 16.5936 13.4336 17.0413 11.9704 17.0413H5.7094C4.10215 17.0413 2.9824 16.6476 2.28565 15.8383C1.5859 15.0268 1.3519 13.8096 1.5904 12.2211L2.1724 7.7016C2.5549 5.62935 3.95365 4.90485 5.03665 4.90485C5.13014 4.04271 5.51889 3.22253 6.13562 2.60775C6.84437 1.9035 7.82162 1.5 8.81987 1.5H8.83562ZM12.6709 6.02985H5.03665C4.7059 6.02985 3.6004 6.16335 3.28315 7.87635L2.70415 12.3763C2.5159 13.6386 2.6614 14.5521 3.13765 15.1048C3.6079 15.6508 4.4494 15.9163 5.7094 15.9163H11.9704C12.7564 15.9163 13.8296 15.7596 14.4776 15.0111C14.9921 14.4178 15.1691 13.5343 15.0041 12.3846L14.4199 7.8456C14.1709 6.72735 13.5139 6.02985 12.6709 6.02985ZM11.023 8.11792C11.3335 8.11792 11.6027 8.36992 11.6027 8.68042C11.6027 8.99092 11.368 9.24292 11.0575 9.24292H11.023C10.7125 9.24292 10.4605 8.99092 10.4605 8.68042C10.4605 8.36992 10.7125 8.11792 11.023 8.11792ZM6.65042 8.11792C6.96092 8.11792 7.23017 8.36992 7.23017 8.68042C7.23017 8.99092 6.99467 9.24292 6.68417 9.24292H6.65042C6.33992 9.24292 6.08792 8.99092 6.08792 8.68042C6.08792 8.36992 6.33992 8.11792 6.65042 8.11792ZM8.83337 2.625H8.82212C8.11637 2.625 7.42862 2.90925 6.92987 3.405C6.5236 3.80945 6.25789 4.34115 6.17193 4.9045L11.4814 4.90471C11.2887 3.61603 10.1743 2.625 8.83337 2.625Z"
                fill="#6A6A6A"
              />
            </svg>
            <span className="text-[12px] lg:text-[16px] leading-[8px] tracking-[-0.02em] text-[--sledge-color-text-secondary-6] font-[500] font-sledge-font-family-2 ml-[9.81px]">
              Add to cart
            </span>
          </GlobalProduct.AddToCartButton>
        </div>
      )}
    </div>
  );
}
