import {GlobalProduct, Link} from '..';

import {useContext, useState} from 'react';
import {getClientBrowserParameters} from '@shopify/hydrogen';
import {Badge} from '@sledge-app/react-wishlist';

import {HydrogenContext} from '../Global/HydrogenProvider';

import {SearchIconWidget} from '@sledge-app/react-instant-search';
import {Form} from '@remix-run/react';
import {CustomComponents} from '@sledge-app/core';

interface IHeaderProps {
  isOpen: boolean;
  setCartDrawerState: any;
  menuDrawer?: boolean;
  setMenuDrawer?: any;
  useDummyData?: boolean;
  setUseDummyData?: any;
}

const menuItems = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Catalog',
    link: '/collections/all',
  },
  {
    text: 'Contact',
    link: '/pages/contact',
  },
  {
    text: 'Account',
    link: '/account/login',
  },
];

const consoleStyle =
  'color: white; background: black; border: 1px solid white; padding: 2px 5px; border-radius: 350px;';

export function Header({isOpen, setCartDrawerState}: IHeaderProps) {
  const [menuDrawer, setMenuDrawer] = useState(false);

  const {useDummyData, setUseDummyData} = useContext(HydrogenContext);

  return (
    <header className="bg-white">
      <DesktopHeader
        setCartDrawerState={setCartDrawerState}
        menuDrawer={menuDrawer}
        isOpen={isOpen}
        setMenuDrawer={setMenuDrawer}
        useDummyData={useDummyData}
        setUseDummyData={setUseDummyData}
      />
      <MobileHeader
        setMenuDrawer={setMenuDrawer}
        menuDrawer={menuDrawer}
        isOpen={isOpen}
        setCartDrawerState={setCartDrawerState}
        useDummyData={useDummyData}
        setUseDummyData={setUseDummyData}
      />
    </header>
  );
}

const DesktopHeader = ({
  setCartDrawerState,
  menuDrawer,
  setMenuDrawer,
  useDummyData,
  setUseDummyData,
}: IHeaderProps) => {
  return (
    <nav
      className="flex items-center justify-between container py-[18px]"
      aria-label="Global"
    >
      <div className="flex items-center gap-x-[180px]">
        <Link
          to="/"
          className="-m-1.5 p-1.5 hover:text-sledge-color-text-hover transition duration-200 flex gap-[12px] items-center"
        >
          <SledgeLogo />
          <h4>Sledge</h4>
        </Link>
        <div className="hidden lg:flex lg:gap-x-[32px] font-sledge-font-family-2">
          {menuItems.map((item, index) => {
            return (
              <Link
                key={index}
                to={item.link}
                onClick={() => {
                  setCartDrawerState(false);
                }}
                className={({isActive}) =>
                  isActive
                    ? '!text-[--sledge-color-text-hover] text-[16px] font-[400] leading-[18px] tracking-[0.02em] hover:text-sledge-color-text-hover transition duration-200'
                    : 'text-sledge-color-text-primary text-[16px] font-[400] leading-[18px] tracking-[0.02em] hover:text-sledge-color-text-hover transition duration-200'
                }
              >
                {item.text}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          id="open-drawer"
          onClick={() => {
            setMenuDrawer(true);
          }}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      <div className="hidden lg:flex gap-[20px]">
        <Form
          method="get"
          action="?"
          id="dummy-data-changer"
          className="fixed hidden right-0 bottom-1/2"
        >
          <button
            type="submit"
            onClick={() => setUseDummyData(!useDummyData)}
            className="p-[10px] bg-sledge-color-primary-green-3 text-white text-sm rounded-lg"
            title={
              !useDummyData
                ? `Using dummy products, match image,etc with figma`
                : `Using real store products`
            }
          >
            {!useDummyData ? 'Figma' : 'Store'}
          </button>
        </Form>
        <SearchIconWidget
          size="sm"
          onAfterAddToCart={(state) => {
            if (state === 'success') {
              console.log('%cSledge', consoleStyle, `Add to cart: ${state}`);
            } else {
              console.error('%cSledge', consoleStyle, `Add to cart: ${state}`);
            }
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
          onAfterRenderProduct={(state) => {
            if (state === 'success') {
              console.log('%cSledge', consoleStyle, `Render product: ${state}`);
            } else {
              console.error(
                '%cSledge',
                consoleStyle,
                `Render product: ${state}`,
              );
            }
          }}
        >
          <CustomComponents
            suggestionKeywordList={GlobalProduct.SledgeSuggestionKeywordList}
            otherIndexList={GlobalProduct.SledgeOtherIndexList}
            productCard={GlobalProduct.SledgeProductCard}
            searchViewMoreResult={GlobalProduct.SledgeSearchViewMoreResult}
          />
        </SearchIconWidget>
        <Badge.Root>
          <Badge.HeaderMenu />
        </Badge.Root>
        <Link
          to="#"
          onClick={() => {
            setCartDrawerState(true);
          }}
          className="hover:opacity-75"
        >
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.81719 2.16699C11.9954 2.16699 13.7948 3.82671 14.0167 5.94943L14.0786 5.95016C15.2869 5.95016 16.7561 6.75266 17.2519 9.00349L17.9094 14.0927C18.1453 15.7352 17.8503 17.0527 17.0311 17.9977C16.2161 18.9377 14.9261 19.4352 13.3003 19.4352H6.34361C4.55778 19.4352 3.31361 18.9977 2.53945 18.0985C1.76195 17.1968 1.50195 15.8443 1.76695 14.0793L2.41361 9.05766C2.83861 6.75516 4.39278 5.95016 5.59611 5.95016C5.7 4.99222 6.13194 4.08091 6.8172 3.39783C7.6047 2.61533 8.69053 2.16699 9.79969 2.16699H9.81719ZM14.0786 7.20016H5.59611C5.22861 7.20016 4.00028 7.34849 3.64778 9.25182L3.00445 14.2518C2.79528 15.6543 2.95695 16.6693 3.48611 17.2835C4.00861 17.8902 4.94361 18.1852 6.34361 18.1852H13.3003C14.1736 18.1852 15.3661 18.011 16.0861 17.1793C16.6578 16.5202 16.8544 15.5385 16.6711 14.261L16.0219 9.21766C15.7453 7.97516 15.0153 7.20016 14.0786 7.20016ZM12.2476 9.52024C12.5926 9.52024 12.8918 9.80024 12.8918 10.1452C12.8918 10.4902 12.6309 10.7702 12.2859 10.7702H12.2476C11.9026 10.7702 11.6226 10.4902 11.6226 10.1452C11.6226 9.80024 11.9026 9.52024 12.2476 9.52024ZM7.3892 9.52024C7.7342 9.52024 8.03336 9.80024 8.03336 10.1452C8.03336 10.4902 7.7717 10.7702 7.4267 10.7702H7.3892C7.0442 10.7702 6.7642 10.4902 6.7642 10.1452C6.7642 9.80024 7.0442 9.52024 7.3892 9.52024ZM9.81469 3.41699H9.80219C9.01803 3.41699 8.25386 3.73282 7.6997 4.28366C7.24828 4.73305 6.95304 5.32382 6.85754 5.94977L12.7569 5.95C12.5428 4.51814 11.3046 3.41699 9.81469 3.41699Z"
              fill="black"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

const MobileHeader = ({
  setCartDrawerState,
  menuDrawer,
  setMenuDrawer,
  useDummyData,
  setUseDummyData,
}: IHeaderProps) => {
  return (
    <div
      className={`${menuDrawer ? '' : 'hidden'} mobile-dialog`}
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 z-20" />
      <div className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="-m-1.5 p-1.5">
            <h4>Sledge</h4>
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            id="close-drawer"
            onClick={() => setMenuDrawer(false)}
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6 font-sledge-font-family-2">
              {menuItems.map((item, index) => {
                return (
                  <Link
                    key={index}
                    to={item.link}
                    onClick={() => {
                      setCartDrawerState(false);
                      setMenuDrawer(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:text-sledge-color-text-hover transition duration-200"
                  >
                    {item.text}
                  </Link>
                );
              })}
            </div>
            <div className="py-6">
              <div className="flex gap-[20px]">
                <SearchIconWidget
                  size="sm"
                  onAfterAddToCart={(state) => {
                    if (state === 'success') {
                      console.log(
                        '%cSledge',
                        consoleStyle,
                        `Add to cart: ${state}`,
                      );
                    } else {
                      console.error(
                        '%cSledge',
                        consoleStyle,
                        `Add to cart: ${state}`,
                      );
                    }
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
                  onAfterRenderProduct={(state) => {
                    if (state === 'success') {
                      console.log(
                        '%cSledge',
                        consoleStyle,
                        `Render product: ${state}`,
                      );
                    } else {
                      console.error(
                        '%cSledge',
                        consoleStyle,
                        `Render product: ${state}`,
                      );
                    }
                  }}
                >
                  <CustomComponents
                    suggestionKeywordList={
                      GlobalProduct.SledgeSuggestionKeywordList
                    }
                    otherIndexList={GlobalProduct.SledgeOtherIndexList}
                    productCard={GlobalProduct.SledgeProductCard}
                    searchViewMoreResult={
                      GlobalProduct.SledgeSearchViewMoreResult
                    }
                  />
                </SearchIconWidget>
                <Badge.Root>
                  <Badge.HeaderMenu />
                </Badge.Root>
                <Link
                  to="#"
                  onClick={() => {
                    setCartDrawerState(true);
                  }}
                  className="hover:opacity-75"
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.81719 2.16699C11.9954 2.16699 13.7948 3.82671 14.0167 5.94943L14.0786 5.95016C15.2869 5.95016 16.7561 6.75266 17.2519 9.00349L17.9094 14.0927C18.1453 15.7352 17.8503 17.0527 17.0311 17.9977C16.2161 18.9377 14.9261 19.4352 13.3003 19.4352H6.34361C4.55778 19.4352 3.31361 18.9977 2.53945 18.0985C1.76195 17.1968 1.50195 15.8443 1.76695 14.0793L2.41361 9.05766C2.83861 6.75516 4.39278 5.95016 5.59611 5.95016C5.7 4.99222 6.13194 4.08091 6.8172 3.39783C7.6047 2.61533 8.69053 2.16699 9.79969 2.16699H9.81719ZM14.0786 7.20016H5.59611C5.22861 7.20016 4.00028 7.34849 3.64778 9.25182L3.00445 14.2518C2.79528 15.6543 2.95695 16.6693 3.48611 17.2835C4.00861 17.8902 4.94361 18.1852 6.34361 18.1852H13.3003C14.1736 18.1852 15.3661 18.011 16.0861 17.1793C16.6578 16.5202 16.8544 15.5385 16.6711 14.261L16.0219 9.21766C15.7453 7.97516 15.0153 7.20016 14.0786 7.20016ZM12.2476 9.52024C12.5926 9.52024 12.8918 9.80024 12.8918 10.1452C12.8918 10.4902 12.6309 10.7702 12.2859 10.7702H12.2476C11.9026 10.7702 11.6226 10.4902 11.6226 10.1452C11.6226 9.80024 11.9026 9.52024 12.2476 9.52024ZM7.3892 9.52024C7.7342 9.52024 8.03336 9.80024 8.03336 10.1452C8.03336 10.4902 7.7717 10.7702 7.4267 10.7702H7.3892C7.0442 10.7702 6.7642 10.4902 6.7642 10.1452C6.7642 9.80024 7.0442 9.52024 7.3892 9.52024ZM9.81469 3.41699H9.80219C9.01803 3.41699 8.25386 3.73282 7.6997 4.28366C7.24828 4.73305 6.95304 5.32382 6.85754 5.94977L12.7569 5.95C12.5428 4.51814 11.3046 3.41699 9.81469 3.41699Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SledgeLogo() {
  return <img src="/logo-new.png" width={30} height={30} alt="sledge logo" />;
}
