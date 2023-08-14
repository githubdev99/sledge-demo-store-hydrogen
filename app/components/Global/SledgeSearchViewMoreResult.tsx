import {Link} from '@remix-run/react';

export const SledgeSearchViewMoreResult = ({
  keyword,
  setShowPopupComponent,
}: any) => {
  console.log('SearchViewMoreResult', keyword);

  return (
    <Link
      to={`/pages/search-result?q=${keyword}`}
      className="sledge-instant-search__icon-widget-button-more"
      onClick={() => setShowPopupComponent && setShowPopupComponent(false)}
    >
      View More Result
    </Link>
  );
};
