/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable hydrogen/prefer-image-component */
/* eslint-disable @typescript-eslint/naming-convention */

import {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {Trigger} from '@sledge-app/react-wishlist';
import {Rating} from '@sledge-app/react-product-review';
import {Link} from '@remix-run/react';
import {GlobalProduct} from '..';

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export const SledgeProductCard = ({product}: any) => {
  console.log('SledgeProductCard', product);

  const {
    id,
    admin_graphql_api_id,
    title,
    image,
    handle,
    url,
    vendor,
    currency,
    variants,
  } = product || {};
  const {
    id: variant_id = '',
    admin_graphql_api_id: variant_admin_graphql_api_id = '',
    title: variant_title = '',
    price = '',
    sku = '',
    is_out_of_stock = false,
  } = variants?.length ? variants[0] : {};

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: admin_graphql_api_id,
    variantGid: variant_admin_graphql_api_id,
    name: title,
    variantName: variant_title,
    brand: vendor,
    price,
    quantity: 1,
  };

  return (
    <div className="sledge__product-grid-card">
      <div className="sledge__product-grid-content">
        <div className="sledge__product-grid-card-image">
          <Link to={'/products/' + handle}>
            <Trigger
              data={{
                productId: id,
                productVariantId: variant_id,
                productName: title,
                productVendor: vendor,
                productSku: sku,
                productVariantName: variant_title,
                productLink: url,
                productImage: image?.src || '',
                productCurrency: currency,
                productPrice: price,
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
            <img
              src={image?.src || ''}
              alt="sledge-product-card-image"
              loading="lazy"
            />
          </Link>
          {is_out_of_stock ? (
            <div className="sledge__product-grid-card-out-of-stock">
              Sold out
            </div>
          ) : null}
        </div>
        <div className="sledge__product-grid-card-desc">
          <div className="sledge__product-grid-card-title">
            {title ? (
              <Link to={'/products/' + handle}>
                <h3>{title}</h3>
              </Link>
            ) : null}
            <div className="sledge__product-grid-card-price">
              <p>
                {currency}
                {price}
              </p>
            </div>
          </div>
          <div className="sledge__product-grid-card-text">
            <div>{variant_title}</div>
            <div>
              <>Vendor: {vendor}</>
              <> | </>
              <>SKU: {sku}</>
            </div>
          </div>
          <div className="sledge__product-grid-card-rating">
            <Rating
              data={{
                productId: id,
              }}
              size="xs"
            />
          </div>
        </div>
      </div>
      {is_out_of_stock ? (
        <span className="relative z-10 inline-flex mt-[16px] items-center py-[11px] px-[16.33px] border-[1px] border-[--sledge-color-text-secondary-6] rounded-[360px] bg-sledge-color-grey-4 text-[--sledge-color-text-secondary-6] cursor-not-allowed w-fit">
          Out Of Stock
        </span>
      ) : (
        <div>
          <GlobalProduct.AddToCartButton
            lines={[
              {
                quantity: 1,
                merchandiseId: variant_admin_graphql_api_id,
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
};
