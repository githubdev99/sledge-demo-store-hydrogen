import {Suspense, useEffect, useRef, useState} from 'react';
import {useOutsideClick} from '~/lib/useOutsideClick';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {Await, useFetcher, useMatches} from '@remix-run/react';
import {Global, Link, IconLoading} from '..';
import {CartAction} from '~/lib/type';

interface ICartDrawerProps {
  isOpen: boolean;
  setCartDrawerState: any;
}

export function CartDrawer({isOpen, setCartDrawerState}: ICartDrawerProps) {
  const [root] = useMatches();
  const ref: any = useRef();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  useEffect(() => {
    if (isOpen || !addToCartFetchers.length) return;
    setCartDrawerState(true);
  }, [addToCartFetchers, isOpen]);

  useOutsideClick(ref, () => {
    if (isOpen) setCartDrawerState(false);
  });

  return (
    <div
      className={`${
        isOpen ? 'opacity-100 visible ' : ' opacity-0 invisible'
      } relative z-50 transition-all`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={ref}
            className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full"
          >
            <div className="pointer-events-auto w-screen max-w-md">
              <Suspense fallback={<div>Loading</div>}>
                <Await resolve={root.data?.cart}>
                  {(cart) => (
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2
                            className="text-lg font-medium text-gray-900"
                            id="slide-over-title"
                          >
                            Shopping cart
                          </h2>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => {
                                setCartDrawerState(false);
                              }}
                            >
                              <span className="sr-only">Close panel</span>
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
                        </div>
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {!cart?.lines.edges.length ? (
                                <CartEmpty />
                              ) : (
                                cart?.lines.edges.map(
                                  (lineItem: any, index: any) => {
                                    const {node} = lineItem;
                                    return (
                                      <li key={index} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[20px]">
                                          <img
                                            src={node.merchandise.image.url}
                                            alt="Product Image"
                                            width={node.merchandise.image.width}
                                            height={
                                              node.merchandise.image.height
                                            }
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                          <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                              <h5>
                                                <Link
                                                  to={
                                                    '/products/' +
                                                    node.merchandise.product
                                                      .handle
                                                  }
                                                  onClick={() =>
                                                    setCartDrawerState(false)
                                                  }
                                                >
                                                  {
                                                    node.merchandise.product
                                                      .title
                                                  }
                                                </Link>
                                              </h5>
                                              <p className="ml-4">
                                                <strong>
                                                  {
                                                    node.cost.totalAmount
                                                      .currencyCode
                                                  }
                                                </strong>
                                                <strong>
                                                  {node.cost.totalAmount.amount}
                                                </strong>
                                              </p>
                                            </div>
                                            {!node.merchandise.selectedOptions
                                              .length ? null : (
                                              <p className="flex gap-[10px] font-sledge-font-family-1 text-[14px] leading-[22px] tracking-[-0.02em] text-sledge-color-text-secondary-1 mt-[12px] mb-2">
                                                {node.merchandise.selectedOptions.map(
                                                  (
                                                    option: any,
                                                    index: number,
                                                  ) => {
                                                    return (
                                                      <span
                                                        key={index}
                                                        className="flex gap-[3px]"
                                                      >
                                                        <span>
                                                          {option.name + ':'}
                                                        </span>
                                                        <span>
                                                          {option.value}
                                                        </span>
                                                      </span>
                                                    );
                                                  },
                                                )}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex flex-1 justify-between text-sm items-center">
                                            <CartQuantityAdjust line={node} />
                                            <div className="flex">
                                              <ItemRemoveButton
                                                lineIds={[node.id]}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  },
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {!cart?.lines.edges.length ? null : (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>

                            {cart?.cost?.subtotalAmount?.amount ? (
                              <p>{cart?.cost?.subtotalAmount?.amount}</p>
                            ) : (
                              '-'
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Shipping and taxes calculated at checkout.
                          </p>
                          <div className="mt-6">
                            <Link
                              to={'/cart'}
                              className="block text-center mb-[8px] py-[17px] px-[73px] bg-[--sledge-color-grey-4] rounded-[12px] font-sledge-font-family-2 font-[700] text-[14px] leading-[14px] tracking-[-2%] text-sledge-color-primary-black hover:opacity-75"
                              onClick={() => setCartDrawerState(false)}
                            >
                              <span>
                                View My Cart{' '}
                                {!cart?.lines?.edges.length
                                  ? null
                                  : '(' + cart?.lines?.edges.length + ')'}
                              </span>
                            </Link>
                            <a
                              href={cart?.checkoutUrl}
                              className="block text-center py-[17px] px-[73px] bg-[--sledge-color-primary-green-4] rounded-[12px] font-sledge-font-family-2 font-[700] text-[14px] leading-[14px] tracking-[-2%] text-sledge-color-primary-black hover:opacity-75"
                            >
                              <span>Checkout</span>
                            </a>
                          </div>
                          <div className="mt-[16px] flex justify-center text-center ">
                            <p>
                              <button
                                type="button"
                                onClick={() => setCartDrawerState(false)}
                                className="font-sledge-font-family-2 text-black font-[400] text-[14px] leading-[15.4px] tracking-[-2%]"
                              >
                                Continue Shopping
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartQuantityAdjust({line}: any) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  let {id: lineId, quantity} = line;

  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  const fetcher = useFetcher();
  const fetcherIsNotIdle = fetcher.state !== 'idle';

  return (
    <div className="w-fit">
      <label htmlFor="Quantity" className="sr-only">
        Quantity
      </label>
      {fetcherIsNotIdle ? (
        <IconLoading />
      ) : (
        <div className="flex items-center border border-[--sledge-color-grey-5] rounded-[8px] py-[4px] px-[8px]">
          <fetcher.Form action="/cart" method="post">
            <input
              type="hidden"
              name="cartAction"
              value={CartAction.UPDATE_CART}
            />
            <input
              type="hidden"
              name="lines"
              value={JSON.stringify([{id: lineId, quantity: prevQuantity}])}
            />
            <button
              name="decrease-quantity"
              aria-label="Decrease quantity"
              className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75"
              value={prevQuantity}
              disabled={quantity <= 1}
            >
              <span>&#8722;</span>
            </button>
          </fetcher.Form>
          <input
            type="number"
            id="Quantity"
            value={quantity}
            readOnly
            className="font-sledge-font-family-3 text-sledge-color-primary-black 
                                                        !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center 
                                                        [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
                                                        focus:border-none focus:box-shadow-none"
          />
          <fetcher.Form action="/cart" method="post">
            <input
              type="hidden"
              name="cartAction"
              value={CartAction.UPDATE_CART}
            />
            <input
              type="hidden"
              name="lines"
              value={JSON.stringify([{id: lineId, quantity: nextQuantity}])}
            />
            <button
              className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75"
              name="increase-quantity"
              value={nextQuantity}
              aria-label="Increase quantity"
            >
              <span>&#43;</span>
            </button>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
}

export function ItemRemoveButton({lineIds}: any) {
  const fetcher = useFetcher();
  const fetcherIsNotIdle = fetcher.state !== 'idle';
  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="bg-white hover:text-white hover:opacity-75 rounded-md font-small text-center my-2 max-w-xl leading-none border w-10 h-10 flex items-center justify-center"
        type="submit"
      >
        {fetcherIsNotIdle ? (
          <svg
            className="h-5 w-5 animate-spin text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.3846 8.72C19.7976 8.754 20.1056 9.115 20.0726 9.528C20.0666 9.596 19.5246 16.307 19.2126 19.122C19.0186 20.869 17.8646 21.932 16.1226 21.964C14.7896 21.987 13.5036 22 12.2466 22C10.8916 22 9.5706 21.985 8.2636 21.958C6.5916 21.925 5.4346 20.841 5.2456 19.129C4.9306 16.289 4.3916 9.595 4.3866 9.528C4.3526 9.115 4.6606 8.753 5.0736 8.72C5.4806 8.709 5.8486 8.995 5.8816 9.407C5.88479 9.45041 6.10514 12.184 6.34526 14.8887L6.39349 15.4285C6.51443 16.7728 6.63703 18.0646 6.7366 18.964C6.8436 19.937 7.3686 20.439 8.2946 20.458C10.7946 20.511 13.3456 20.514 16.0956 20.464C17.0796 20.445 17.6116 19.953 17.7216 18.957C18.0316 16.163 18.5716 9.475 18.5776 9.407C18.6106 8.995 18.9756 8.707 19.3846 8.72ZM14.3454 2.00031C15.2634 2.00031 16.0704 2.61931 16.3074 3.5063L16.5614 4.7673C16.6435 5.18068 17.0062 5.48256 17.4263 5.48919L20.708 5.4893C21.122 5.4893 21.458 5.8253 21.458 6.2393C21.458 6.6533 21.122 6.9893 20.708 6.9893L17.4556 6.98915C17.4505 6.98925 17.4455 6.9893 17.4404 6.9893L17.416 6.9883L7.04162 6.98918C7.03355 6.98926 7.02548 6.9893 7.0174 6.9893L7.002 6.9883L3.75 6.9893C3.336 6.9893 3 6.6533 3 6.2393C3 5.8253 3.336 5.4893 3.75 5.4893L7.031 5.4883L7.13202 5.48191C7.50831 5.43309 7.82104 5.1473 7.8974 4.7673L8.1404 3.5513C8.3874 2.61931 9.1944 2.00031 10.1124 2.00031H14.3454ZM14.3454 3.5003H10.1124C9.8724 3.5003 9.6614 3.6613 9.6004 3.8923L9.3674 5.0623C9.33779 5.2105 9.29467 5.35332 9.23948 5.48957H15.2186C15.1634 5.35332 15.1201 5.2105 15.0904 5.0623L14.8474 3.8463C14.7964 3.6613 14.5854 3.5003 14.3454 3.5003Z"
              fill="#F85538"
            />
          </svg>
        )}
      </button>
    </fetcher.Form>
  );
}

export function CartEmpty() {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:px-12 px-4 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Global.Button
        text="Continue shopping"
        textColor="text-white"
        color="bg-sledge-color-primary-green-3"
        className="mt-[8px] lg:mt-[12px] mb-4 !w-fit"
        isArrow={false}
        type={'link'}
        link={'/collections/all'}
      />
    </div>
  );
}
