import {flattenConnection, parseGid} from '@shopify/hydrogen';
import {FormMethod, useFetcher} from '@remix-run/react';
import {Link} from '..';
import {CartAction} from '~/lib/type';
import {getInputStyleClasses} from '~/lib/utils';
import {Global, IconLoading} from '..';
import {ReviewBadge} from '../Sledge';
import {useEffect, useState} from 'react';

export function CartComponents({cart}: any) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);
  return <>{!linesCount ? <CartEmpty /> : <CartDetails cart={cart} />}</>;
}

export function CartDetails({cart}: any) {
  const {cost} = cart;
  const [removedItems, setRemovedItems] = useState([]);
  return (
    <>
      <div className="flex justify-between">
        <h2>Your Cart</h2>
        <Global.Button
          text="Continue Shopping"
          textColor="text-white"
          color="bg-sledge-color-primary-green-3"
          className="mt-0 !w-fit"
          isArrow={false}
          type={'link'}
          link={'/collections/all'}
        />
      </div>
      <MultipleRemoveItem
        removedItems={removedItems}
        setRemovedItems={setRemovedItems}
      />
      <div className="mt-8">
        <div className="min-w-full py-2 align-middle gap-[40px] flex flex-col overflow-x-auto">
          <CartTable
            linesObj={cart.lines}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
      </div>
      <div className="flex mb-10 mt-[30px] lg:mt-[77px] lg:justify-end">
        <div className="flex flex-col gap-[16px] w-full lg:w-[330px]">
          <CartSummary cost={cost} />
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    </>
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

export function CartTable({linesObj, removedItems, setRemovedItems}: any) {
  const lines = flattenConnection(linesObj);
  return (
    <table className="min-w-full divide-y divide-[--sledge-color-grey-4]">
      <thead>
        <tr>
          <th
            scope="col"
            className="font-sledge-font-family-1 font-[400] text-[12px] leading-[19px] tracking-[-0.02em] text-sledge-color-primary-black text-left pb-[10px]"
          ></th>
          <th
            scope="col"
            className="font-sledge-font-family-1 font-[400] text-[12px] leading-[19px] tracking-[-0.02em] text-sledge-color-primary-black text-left pb-[10px] pl-[15px]"
          >
            Product
          </th>
          <th
            scope="col"
            className="font-sledge-font-family-1 font-[400] text-[12px] leading-[19px] tracking-[-0.02em] text-sledge-color-primary-black text-left pl-[20px] pb-[10px]"
          >
            Quantity
          </th>
          <th
            scope="col"
            className="font-sledge-font-family-1 font-[400] text-[12px] leading-[19px] tracking-[-0.02em] text-sledge-color-primary-black text-left pb-[10px]"
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {lines.map((lineItem: any, index: any) => {
          const {merchandise, quantity} = lineItem;
          return (
            <tr key={index}>
              <td className="whitespace-nowrap">
                <div className="flex items-center lg:pl-[4px]">
                  <input
                    id={`cart-${merchandise.id}`}
                    type="checkbox"
                    className="h-[20px] w-[20px] text-[--sledge-color-primary-green-3] rounded-[4px] cursor-pointer focus:ring-[--sledge-color-primary-green-3]"
                    name={merchandise.id}
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRemovedItems([...removedItems, lineItem.id]);
                      } else {
                        setRemovedItems(
                          removedItems.filter(
                            (item: any) => item !== lineItem.id,
                          ),
                        );
                      }
                    }}
                  />
                </div>
              </td>
              <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div className="flex items-center gap-[32px]">
                  <Link
                    to={'/products/' + merchandise.product.handle}
                    className="flex-shrink-0 flex justify-center items-center mr-[15px] md:mr-[32px] bg-sledge-color-grey-4 rounded-[24px] hover:opacity-75"
                  >
                    <img
                      src={merchandise.image.url}
                      alt="Product Image"
                      width={merchandise.image.width}
                      height={merchandise.image.height}
                      className="w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] object-cover object-center"
                    />
                  </Link>
                  <div>
                    <h5 className="leading-[24px] text-sledge-color-text-primary">
                      {merchandise.product.title}
                    </h5>
                    <p className="font-sledge-font-family-1 text-[14px] leading-[22px] tracking-[-0.02em] text-sledge-color-text-secondary-1 mt-[12px] mb-2">
                      Vendor: {merchandise.product.vendor} | SKU:{' '}
                      {merchandise.sku}{' '}
                    </p>
                    <ReviewBadge
                      productId={parseGid(merchandise.product.id).id}
                    />
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <CartQuantityAdjust line={lineItem} />
              </td>
              <td className="whitespace-nowrap min-w-[120px] lg:min-w-fit">
                <span className="font-sledge-font-family-2 text-[28px] md:text-[32px] leading-[38px] text-sledge-color-text-primary">
                  <strong>{lineItem.cost.totalAmount.currencyCode}</strong>
                  <strong>{lineItem.cost.totalAmount.amount}</strong>
                </span>
              </td>
              <td className="whitespace-nowrap min-w-[60px] lg:min-w-fit">
                <ItemRemoveButton lineIds={[lineItem.id]} />
              </td>
            </tr>
          );
        })}
        {/* More people... */}
      </tbody>
    </table>
  );
}

export function CartActions({checkoutUrl}: any) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col">
      <Link
        to={checkoutUrl}
        className="bg-sledge-color-primary-green-4 font-[700] text-[14px] leading-[15.4px] tracking-[-2%] text-center rounded-[12px] py-[17px]"
      >
        Buy Now
      </Link>
      <p className="font-sledge-font-family-1 text-sledge-color-grey-5 text-[14px] leading-[22.4px] tracking-[-2%] mt-[12px]">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}

export function CartSummary({cost}: any) {
  return (
    <dl className="space-y-2">
      <div className="flex items-center justify-between">
        <dt className="font-sledge-font-family-1 font-[400] text-[14px] leading-[22.4px] tracking-[-2%]">
          Subtotal
        </dt>
        <dd className="font-sledge-font-family-2 font-[700] text-[14px] lg:text-[26px] leading-[15.4px] tracking-[-2%] ">
          {cost?.subtotalAmount?.amount ? (
            <p>
              <span>{cost?.subtotalAmount.currencyCode}</span>
              {cost?.subtotalAmount?.amount}
            </p>
          ) : (
            '-'
          )}
        </dd>
      </div>
    </dl>
  );
}

export function CartQuantityAdjust({line}: any) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  const fetcher = useFetcher();
  const fetcherIsNotIdle = fetcher.state !== 'idle';

  return (
    <div
      className={`${
        fetcherIsNotIdle ? 'w-full max-w-[88px] flex justify-center' : 'w-fit'
      }`}
    >
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
            defaultValue={quantity}
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
          <IconLoading />
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

export function MultipleRemoveItem({removedItems, setRemovedItems}: any) {
  const fetcher = useFetcher();

  if (fetcher.state === 'loading') {
    setRemovedItems([]);
    //TODO : querySelectorAll
    (document.querySelectorAll('input[type="checkbox"]') as any).forEach(
      (el: any) => {
        el.checked = false;
      },
    );
  }

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input
        type="hidden"
        name="linesIds"
        value={JSON.stringify(removedItems)}
      />

      {removedItems.length ? (
        <Global.Button
          text={`Remove Selected (${removedItems.length})`}
          textColor="text-white"
          color="bg-sledge-color-primary-red-2"
          className="mt-[10px] !w-fit"
          isArrow={false}
          type={'button'}
          loading={fetcher.state}
        />
      ) : null}
    </fetcher.Form>
  );
}

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
export function CartDiscounts({discountCodes}: any) {
  const codes = discountCodes?.map(({code}: any) => code).join(', ') || null;

  return (
    <>
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          <dt>Discount(s)</dt>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button>
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
              </button>
            </UpdateDiscountForm>
            <dd>{codes}</dd>
          </div>
        </div>
      </dl>

      {/* No discounts, show an input to apply a discount */}
      <UpdateDiscountForm>
        <div
          className={`${
            codes ? 'hidden' : 'flex'
          } items-center gap-4 justify-between text-copy`}
        >
          <input
            className={getInputStyleClasses()}
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <button className="flex justify-end font-medium whitespace-nowrap">
            Apply Discount
          </button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({children}: any) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/cart" method="post">
      <input
        type="hidden"
        name="cartAction"
        value={CartAction.UPDATE_DISCOUNT}
      />
      {children}
    </fetcher.Form>
  );
}
