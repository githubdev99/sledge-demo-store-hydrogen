interface InputInterface {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  width?: 'full' | '50%';
  autoComplete?: 'on' | 'off';
  required?: boolean;
  className?: any;
  quantityState?: number;
  setQuantityState: any;
  maxQuantity: number;
}

export function Input({
  label,
  type,
  name,
  placeholder,
  width = '50%',
  autoComplete = 'on',
  required = true,
  className,
  quantityState,
  setQuantityState,
  maxQuantity,
  ...props
}: any) {
  return (
    <>
      {(type === 'quantity' && (
        <div className="w-fit">
          <label htmlFor={name} className="sr-only">
            {' '}
            {label}{' '}
          </label>
          <div className="flex items-center border border-[--sledge-color-grey-5] rounded-[8px] py-[4px] px-[8px]">
            <button
              type="button"
              className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75"
              onClick={() => {
                if (quantityState > 1) setQuantityState(quantityState - 1);
              }}
            >
              -
            </button>
            <input
              {...props}
              type="number"
              id={name}
              name={name}
              min="1"
              onChange={(e) => {
                if (Number(e.target.value) === 0) e.target.value = '1';
                if (Number(e.target.value) > maxQuantity)
                  e.target.value = maxQuantity;
                setQuantityState(Number(e.target.value));
              }}
              value={quantityState}
              autoComplete="off"
              className="font-sledge-font-family-3 text-sledge-color-primary-black 
                                        !p-0 text-[12px] leading-[15px] tracking-[-0.02em] md:text-[14px] max-w-[38px] border-transparent text-center 
                                        [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none 
                                        focus:border-none focus:box-shadow-none"
            />
            <button
              type="button"
              className="flex justify-center items-center text-sledge-color-grey-5 w-[16px] h-[16px] transition hover:opacity-75"
              onClick={() => {
                if (quantityState < maxQuantity)
                  setQuantityState(quantityState + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      )) || (
        <div className={width === '50%' ? 'sm:col-span-3' : 'col-span-full'}>
          <label htmlFor={name} className="sr-only">
            {label}
          </label>

          {(type !== 'textarea' && (
            <input
              type={type}
              name={name}
              id={name}
              autoComplete={autoComplete}
              placeholder={placeholder}
              required={required}
              className={`block w-full pl-[24px] py-[21px] border-[1px] border-solid border-[#D4D4D4] rounded-[12px] !font-sledge-font-family-2 !text-[14px] md:!text-[18px] !leading-[22px] !text-sledge-color-text-secondary-2 focus:ring-2 focus:ring-inset focus:ring-sledge-color-primary-green-3 focus:border-sledge-color-primary-green-3 ${className}`}
              {...props}
            />
          )) || (
            <textarea
              placeholder={placeholder}
              rows={4}
              name={name}
              id={name}
              className="block w-full pl-[24px] py-[21px] border-[1px] border-solid border-[#D4D4D4] rounded-[12px] !font-sledge-font-family-2 !text-[14px] md:!text-[18px] !leading-[22px] !text-sledge-color-text-secondary-2 focus:ring-2 focus:ring-inset focus:ring-sledge-color-primary-green-3 focus:border-sledge-color-primary-green-3"
            ></textarea>
          )}
        </div>
      )}
    </>
  );
}
