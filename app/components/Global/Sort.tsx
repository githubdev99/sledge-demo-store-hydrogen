import {useSearchParams, useLocation, useParams} from '@remix-run/react';
import {Link} from '..';
import {useState, useRef} from 'react';
import {useOutsideClick} from '~/lib/useOutsideClick';

export function getSortLink(sort: any, params: URLSearchParams, location: any) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

export function SortBy() {
  const items = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];

  const [params] = useSearchParams();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const ref: any = useRef();
  useOutsideClick(ref, () => {
    if (isOpen) setIsOpen(false);
  });

  const activeItem = location?.search.split('?sort=')[1];

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="py-[10px] px-[16px] gap-[10px] font-sledge-font-family-1 text-sledge-color-primary-black text-[12px] lg:text-[16px] leading-[17.6px] tracking-[-2%] flex items-center rounded-full bg-sledge-color-grey-1 focus:outline-none focus:ring-2 focus:ring-sledge-color-primary-green-1  focus:ring-offset-2 focus:ring-offset-gray-100"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open options</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2266 3.86449C11.4797 3.86449 11.6889 4.05259 11.722 4.29664L11.7266 4.36449L11.7265 12.2312L13.5906 10.3595C13.7855 10.1638 14.102 10.1631 14.2977 10.3579C14.4757 10.535 14.4924 10.8127 14.3477 11.0088L14.2994 11.065L11.5809 13.7961C11.5645 13.8122 11.5478 13.8268 11.5302 13.8403L11.5809 13.7961C11.5563 13.8208 11.5299 13.8423 11.502 13.8608C11.4922 13.8668 11.4821 13.873 11.4718 13.8789C11.4622 13.8846 11.4524 13.8897 11.4425 13.8945C11.4328 13.8988 11.4229 13.9031 11.4128 13.9072C11.4 13.9127 11.3869 13.9173 11.3736 13.9213C11.3658 13.9234 11.3578 13.9257 11.3497 13.9277C11.3353 13.9317 11.3209 13.9347 11.3063 13.937C11.2995 13.9378 11.2924 13.9388 11.2852 13.9396C11.2687 13.9419 11.2525 13.943 11.2362 13.9433C11.2329 13.943 11.2298 13.943 11.2266 13.943L11.2168 13.9433C11.2005 13.943 11.1843 13.9419 11.168 13.94L11.2266 13.943C11.1993 13.943 11.1726 13.9408 11.1465 13.9366C11.1321 13.9347 11.1177 13.9317 11.1033 13.9281C11.0957 13.9258 11.0881 13.9237 11.0806 13.9214C11.0663 13.9174 11.052 13.9123 11.038 13.9066C11.0303 13.9031 11.0229 13.8999 11.0156 13.8965C11.0041 13.8915 10.9925 13.8856 10.9812 13.8792C10.971 13.873 10.9609 13.8668 10.951 13.8603C10.9433 13.8557 10.9357 13.8504 10.9283 13.8448L10.9229 13.8403C10.9053 13.8268 10.8887 13.8122 10.873 13.7966L10.8721 13.7961L8.15361 11.065C7.9588 10.8693 7.95953 10.5527 8.15524 10.3579C8.33316 10.1808 8.61097 10.1653 8.80638 10.311L8.86234 10.3595L10.7265 12.2325L10.7266 4.36449C10.7266 4.08835 10.9504 3.86449 11.2266 3.86449ZM4.6076 2.05545L4.61734 2.05518C4.63364 2.05549 4.64992 2.05659 4.66612 2.05849L4.6076 2.05545C4.63484 2.05545 4.66157 2.05763 4.68763 2.06182C4.70188 2.06377 4.71619 2.06671 4.73037 2.07029C4.7387 2.07273 4.7472 2.07512 4.75561 2.07772C4.76874 2.08142 4.78144 2.08592 4.79399 2.09095C4.80306 2.09499 4.81224 2.099 4.82127 2.10328C4.83201 2.10792 4.84258 2.11338 4.85299 2.11925C4.8619 2.12473 4.87072 2.13008 4.87936 2.13568C4.88825 2.14097 4.89716 2.14716 4.90589 2.15366L4.96205 2.20235L7.68057 4.93346C7.87538 5.12917 7.87465 5.44575 7.67893 5.64056C7.50101 5.81766 7.2232 5.83316 7.02779 5.68747L6.97183 5.63893L5.10716 3.76518L5.1076 11.634C5.1076 11.9101 4.88375 12.134 4.6076 12.134C4.35447 12.134 4.14528 11.9459 4.11217 11.7018L4.1076 11.634L4.10716 3.76584L2.24353 5.63893C2.06643 5.81685 1.78869 5.83363 1.59262 5.68885L1.53642 5.64056C1.3585 5.46346 1.34172 5.18573 1.48651 4.98965L1.53479 4.93346L4.25331 2.20235L4.28275 2.17535C4.28966 2.16943 4.29674 2.16371 4.30397 2.15817L4.25331 2.20235C4.27784 2.17771 4.30429 2.15616 4.33219 2.1377C4.34192 2.13164 4.35204 2.12545 4.36239 2.11961C4.37199 2.11382 4.38176 2.10874 4.39165 2.10401C4.40141 2.09969 4.41132 2.09533 4.42138 2.09128C4.43417 2.08581 4.44729 2.08118 4.46054 2.07712C4.4686 2.07495 4.47686 2.07264 4.4852 2.07054C4.49863 2.06686 4.51221 2.06403 4.52587 2.06178C4.53408 2.06076 4.54213 2.05964 4.55023 2.05871C4.56567 2.05659 4.5815 2.05551 4.59735 2.05519C4.60084 2.05549 4.60422 2.05545 4.6076 2.05545Z"
              fill="black"
            />
          </svg>
          Sort By
        </button>
      </div>
      <div
        ref={ref}
        className={`${
          !isOpen ? 'hidden' : 'block'
        } absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {items.map((item, index) => {
            return (
              <Link
                to={getSortLink(item.key, params, location)}
                onClick={() => {
                  setIsOpen(false);
                }}
                preventScrollReset={true}
                key={index}
                className={`text-sledge-color-primary-black block px-4 py-2 text-sm ${
                  activeItem === item.key ? 'bg-sledge-color-grey-1' : ''
                }`}
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
