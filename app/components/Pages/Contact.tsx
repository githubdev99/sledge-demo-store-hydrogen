import {useFetcher, type Form as FormType} from '@remix-run/react';
import {Global} from '..';
import image from './assets/businessowner-always-keep-contact-with-customer_1.png';

export const meta = () => {
  return [{title: 'Contact'}];
};

export function Contact() {
  const {Form, ...fetcher} = useFetcher();
  const data = fetcher?.data;
  const formSubmitted = data?.form;
  const formError = data?.error;

  return (
    <div className="flex gap-[50px] flex-col lg:flex-row">
      <Global.CardImage
        image={image}
        title="Brooklyn Simmons"
        descripton="Sed at vitae viverra vitae sagittis nibh. Tellus odio congue nulla rhoncus sagittis vitae arcu. Ullamcorper elementum est ipsum sed gravida."
      />

      <div className="flex flex-col flex-auto lg:mt-[20px] gap-[20px] md:gap-0">
        <div className="">
          <h1>Contact with us</h1>
          <p className="max-w-[594px] font-sledge-font-family-1 text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-sledge-color-text-secondary-1">
            Sed at vitae viverra vitae sagittis nibh. Tellus odio congue nulla
            rhoncus sagittis vitae arcu. Ullamcorper elementum est ipsum sed
            gravida.
          </p>
        </div>
        {!formSubmitted ? (
          <ContactForm Form={Form} formError={formError} />
        ) : (
          <p className="w-fit m-auto text-center text-[16px] md:text-[25px] leading-[26px] tracking-[-0.02em] text-sledge-color-text-secondary-1">
            Thank you for your message. We will get back to you shortly.
          </p>
        )}
      </div>
    </div>
  );
}

function ContactForm({Form, formError}: any) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];

  return (
    <Form
      action="/api/contact-form"
      method="post"
      className="mt-[20px] md:mt-[40px] gap-[40px] flex flex-col"
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2">
          <Global.Input
            label="Name"
            type="text"
            name="name"
            placeholder="Name"
            width={'50%'}
          />
          <Global.Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            width={'50%'}
          />
          <Global.Input
            label="Email"
            type="email"
            name="email"
            placeholder='Email "example@gmail.com"'
            width={'full'}
          />
          <Global.Input
            label="Add your message"
            type="textarea"
            name="message"
            placeholder="Write your message"
            width={'full'}
          />
          <input type="text" hidden name="date" defaultValue={yyyyMmDd} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
        {formError && (
          <div>
            <p className="w-fit text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-sledge-color-primary-red-2">
              There was an error submitting your message. Please try again.
            </p>
            <p>{formError?.message}</p>
          </div>
        )}
        <p className="w-fit text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-sledge-color-text-secondary-1">
          Duis consectetur sed blandit pellentesque arcu consequat.
        </p>
        <Global.Button
          text="Send"
          textColor="text-white"
          color="bg-sledge-color-primary-green-3"
          className="mt-0 !w-fit"
          isArrow={true}
          type={'button'}
        />
      </div>
    </Form>
  );
}
