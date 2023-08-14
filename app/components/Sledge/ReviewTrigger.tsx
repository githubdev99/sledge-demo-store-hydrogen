// interface IReviewBadgeProps {
//     productId?: string,
//     size?: 'sm' | 'md' | 'lg'
// }

export function ReviewBadge({ productId = '', size = "sm" }: any) {
    return (
        <>
            <div
                data-sledge-component="product-review-rating"
                data-sledge-review-product-id={productId}
                data-sledge-rating-size={size}
            ></div>
        </>
    );
}

export function ReviewWidget({ productId, variantId }: any) {
    return (
        <>
            <div
                data-sledge-component="product-review-widget"
                data-sledge-review-product-id={productId}
                data-sledge-review-product-variant-id={variantId}
            ></div>
        </>
    );
}