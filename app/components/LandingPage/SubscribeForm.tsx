import {Form} from '@remix-run/react';
import {Global} from '..';
export function SubscribeForm() {
  return (
    <div className="container mx-auto flex items-center text-center flex-col pt-[48px] mb-[64px] border-t-[1px] border-solid border-[#000000]">
      <div className="max-w-[570px]">
        <h1 className="leading-[53px]">
          Subscribe for get update new products
        </h1>
      </div>
      <div className="font-sledge-font-family-1 max-w-[483px] mt-[12px] lg:mt-[18px]">
        <p className="text-[16px] leading-[26px] tracking-[-0.02em] text-[#6C6C6C]">
          Sit porttitor tempus eget nunc lectus lobortis. Lorem tincidunt sit
          sapien egestas imperdiet suspendisse iaculis.
        </p>
      </div>
      <div className="max-w-[360px] mt-[25px] lg:mt-[16px]">
        {/* //TODO: Need klaviyo third party */}
        <Form>
          <Global.SubscribeInput />
        </Form>
      </div>
    </div>
  );
}
