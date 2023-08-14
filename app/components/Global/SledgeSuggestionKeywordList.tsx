import {Link} from '@remix-run/react';

export const SledgeSuggestionKeywordList = ({
  keywords,
  setShowPopupComponent,
}: any) => {
  return (
    <>
      <div className="sledge-instant-search__icon-widget-search-form-result-title">
        Suggestions
      </div>
      <ul className="sledge-instant-search__icon-widget-search-form-result-list">
        {keywords.map((keyword: string, index: number) => {
          return (
            <li key={index}>
              <Link
                to={`/pages/search-result?q=${keyword}`}
                className="sledge-instant-search__icon-widget-search-form-result-list-link sledge-instant-search__icon-widget-search-form-result-list-link-suggestion"
                onClick={() =>
                  setShowPopupComponent && setShowPopupComponent(false)
                }
              >
                <span className="sledge-icon__search">
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.78283 2.16669C14.2578 2.16669 17.8978 5.80669 17.8978 10.2817C17.8978 12.393 17.0876 14.3186 15.7617 15.7638L18.3707 18.3673C18.6148 18.6114 18.6157 19.0064 18.3715 19.2506C18.2498 19.3739 18.089 19.4348 17.929 19.4348C17.7698 19.4348 17.6098 19.3739 17.4873 19.2523L14.8469 16.6192C13.4579 17.7316 11.6967 18.3975 9.78283 18.3975C5.30783 18.3975 1.66699 14.7567 1.66699 10.2817C1.66699 5.80669 5.30783 2.16669 9.78283 2.16669ZM9.78283 3.41669C5.99699 3.41669 2.91699 6.49585 2.91699 10.2817C2.91699 14.0675 5.99699 17.1475 9.78283 17.1475C13.5678 17.1475 16.6478 14.0675 16.6478 10.2817C16.6478 6.49585 13.5678 3.41669 9.78283 3.41669Z"
                      fill="#677487"
                    />
                  </svg>
                </span>{' '}
                {keyword}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
