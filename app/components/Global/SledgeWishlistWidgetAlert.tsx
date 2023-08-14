import {Link} from '@remix-run/react';

export const SledgeWishlistWidgetAlert = ({setShowPopupComponent}: any) => {
  return (
    <div className="sledge-wishlist__widget-alert">
      <div className="sledge-wishlist__widget-alert-text">
        Please login to save your wishlist across devices.
        <Link
          to="/account/login"
          className="sledge-wishlist__widget-alert-link"
          onClick={() => setShowPopupComponent && setShowPopupComponent(false)}
        >
          Login Here
        </Link>
      </div>
    </div>
  );
};
