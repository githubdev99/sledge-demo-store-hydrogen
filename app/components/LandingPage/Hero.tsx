import {Global} from '~/components';
import {MediaFile} from '@shopify/hydrogen';

export function Hero({
  data,
  className,
  button,
  imagePosition,
  bgColor,
  title,
  description,
}: any) {
  return (
    <div className={`container ${className}`}>
      <div
        className={`${
          imagePosition === 'left'
            ? 'flex-col-reverse lg:flex-row-reverse'
            : 'flex-col lg:flex-row'
        } ${bgColor} items-center relative isolate overflow-hidden flex rounded-[24px]`}
      >
        <div className="text-center lg:flex-auto lg:text-left w-full lg:w-1/2 px-3 lg:pl-[56px] lg:px-0 py-[29px]">
          <h2
            className={`${title.color} mb-[12px] leading-[48px]`}
            dangerouslySetInnerHTML={{__html: data.heroTitle.value}}
          ></h2>
          <p
            className={`${description.color} font-normal text-[16px] leading-[26px] tracking-[-0.02em] max-w-full lg:max-w-[465px]`}
            dangerouslySetInnerHTML={{__html: data.heroDescription.value}}
          ></p>
          <Global.Button
            type={'link'}
            link={'/collections/' + data.handle}
            color={button.bgColor}
            textColor={button.textColor}
            text={data.heroButtonCtaText.value}
            position="left"
            isArrow={false}
          />
        </div>
        <div className="relative w-full lg:w-1/2 h-[40vw] lg:h-auto flex justify-end">
          <MediaFile
            data={data.heroImage.reference}
            className="block object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
