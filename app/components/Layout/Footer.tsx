import {Link} from '..';
import {Global} from '..';

export function Footer() {
  return (
    <div className="bg-[#2B2B2B] pt-[48px] pb-[32px]">
      <div className="container">
        <div className="max-w-fit mb-[24px]">
          <Link
            to="/"
            className="text-white leading-[35.2px] tracking-[-2%] hover:text-sledge-color-text-hover transition duration-200"
          >
            <h3>Sledge</h3>
          </Link>
        </div>
        <div className="flex flex-wrap justify-between gap-y-[50px] flex-col xl:flex-row">
          <div className="max-w-[419px]">
            <p className="text-[--sledge-color-grey-5] text-[14px] md:text-[16px] leading=[25.6px] tracking-[-2%] font-sledge-font-family-1">
              Felis id enim mi vitae accumsan consectetur lacus blandit. In
              senectus in est viverra aliquam. Vulputate eu tellus enim aliquet.
            </p>
          </div>
          <ul
            className="flex flex-col flex-wrap text-[--sledge-color-grey-5] 
                    gap-y-[24px] h-[200px] text-[14px] md:text-[18px] leading-[25.2px] tracking-[-2%] font-sledge-font-family-2"
          >
            <li className="w-auto md:w-[155px]">
              <Link
                to="/collections/all"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                Catalog
              </Link>
            </li>
            <li className="w-auto md:w-[155px]">
              <Link
                to="/pages/contact"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                Contact
              </Link>
            </li>
            <li className="w-auto md:w-[155px]">
              <Link
                to="/account"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                Account
              </Link>
            </li>
            <li className="w-auto md:w-[155px]">
              <Link
                to="/pages/search-result"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                Search
              </Link>
            </li>
            <li className="w-auto md:w-[155px]">
              <Link
                to="/cart"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                Cart
              </Link>
            </li>
            <li className="w-auto md:w-[155px]">
              <Link
                to="/collections/adidas"
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
              >
                New Collection
              </Link>
            </li>
          </ul>
          <div className="flex flex-col xl:ml-[126px] w-fit xl:w-[360px]">
            <div>
              <label htmlFor="subscribe" className="block">
                <h4 className="text-white font-[400] max-w-[271px]">
                  Subscribe For Get Update New Products
                </h4>
              </label>
              <Global.SubscribeInput />
            </div>
          </div>
        </div>
        <div className="flex text-[--sledge-color-grey-5] justify-between mt-[59.8px] font-sledge-font-family-2 flex-col md:flex-row items-center gap-y-4">
          <div>
            <p className="text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em]">
              2023, Dev Learn Apps Powered by shopify
            </p>
          </div>
          <ul className="flex [&>*:nth-child(1)]:before:content-[''] [&>*:nth-child(1)]:before:ml-0 [&>*:nth-child(1)]:before:mr-0 text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em]">
            <li className="before:content-['|'] before:ml-2 before:mr-2">
              <Link
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
                to="/pages/privacy"
              >
                Privacy
              </Link>
            </li>
            <li className="before:content-['|'] before:ml-2 before:mr-2">
              <Link
                className="text-[--sledge-color-grey-5] hover:text-sledge-color-text-hover transition duration-200"
                to="/pages/policy"
              >
                Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
