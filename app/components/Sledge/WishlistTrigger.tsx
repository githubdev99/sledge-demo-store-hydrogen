export function WishlistBadge({ productId = "", variantId = "", name = "", variantName = "", link = "", image = "", currency = "", price = "", className = "" }: any) {
    return (
        <>
            <div
                className={className}
                data-sledge-component="wishlist-trigger"
                data-sledge-wishlist-product-id={productId}
                data-sledge-wishlist-product-variant-id={variantId}
                data-sledge-wishlist-product-name={name}
                data-sledge-wishlist-product-variant-name={variantName}
                data-sledge-wishlist-product-link={link}
                data-sledge-wishlist-product-image={image}
                data-sledge-wishlist-product-currency={currency}
                data-sledge-wishlist-product-price={price}
            ></div>
        </>
    );
}

export function WishlistWidget() {
    return (
        <>
            <div data-sledge-component="wishlist-widget"></div>
        </>
    )
} 