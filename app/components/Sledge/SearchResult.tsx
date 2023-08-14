export function SearchResult() {
  return (
    <div
      data-sledge-component="instant-search-result-widget"
      data-sledge-query-keyword="q"
    ></div>
  );
}

interface ISearchProductFilterProps {
  collcetionId: number;
}

export function SearchProductFilter({collcetionId}: ISearchProductFilterProps) {
  return (
    <div
      data-sledge-component="instant-search-product-filter-widget"
      data-sledge-query-keyword="q"
      data-sledge-instant-search-collection-id={collcetionId}
      data-sledge-api-direct="0"
    ></div>
  );
}
