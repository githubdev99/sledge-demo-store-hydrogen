import {Link} from '..';
import collection1 from './assets/collection_1.png';
import collection2 from './assets/collection_2.png';
import collection3 from './assets/collection_3.png';

export function NewCollection() {
  return (
    <div className="relative container flex flex-col-reverse md:flex-col gap-7 md:gap-0 mb-[87px] mt-[80px]">
      <div className="flex flex-col md:flex-row gap-[24px] md:gap-[30px] mb-[32.5px]">
        <Link to="/collections/vans" className="hover:opacity-75">
          <img className="w-full md:w-fit" src={collection1} alt="" />
        </Link>
        <Link to="/collections/puma" className="hover:opacity-75">
          <img className="w-full md:w-fit" src={collection2} alt="" />
        </Link>
        <Link to="/collections/adidas" className="hover:opacity-75">
          <img className="w-full md:w-fit" src={collection3} alt="" />
        </Link>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1>New Collection</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="max-w-[660px]">
            <p className="text-[12px] font-sledge-font-family-1 lg:text-[16px] leading-[25.6px] tracking-[-0.02em] text-[#6C6C6C]">
              Faucibus semper tincidunt cras imperdiet sit est. Massa eu
              ultricies ultrices quam ornare. Velit eget quisque penatibus non
              sollicitudin enim. Non nec suspendisse eu vestibulum.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center py-[17px] px-[32px] border-[1px] border-[--sledge-color-text-secondary-6] rounded-[360px] bg-white text-[--sledge-color-text-secondary-6] hover:opacity-70 transition duration-200"
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
              <span className="text-[16px] leading-[8px] tracking-[-0.02em] text-[--sledge-color-text-secondary-6] font-[500] font-sledge-font-family-2 ml-[11.81px]">
                Add to cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
