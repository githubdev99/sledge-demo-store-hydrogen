import {
  json,
  redirect,
  type ActionFunction,
  type AppLoadContext,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  type V2_MetaFunction,
} from '@remix-run/react';
import {Link} from '~/components';
import {useState} from 'react';
import {Global} from '~/components';

import {getInputStyleClasses} from '~/lib/utils';

import image from '~/components/Pages/assets/green-classic-jacket-beige-women-s-top-with-handbag-women-s-stylish-autumn-spring-trendy-clothes-fashion-concept-flat-lay-top-view_1.png';

export const handle = {
  isPublic: true,
};

export async function loader({context, params}: LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  // TODO: Query for this?
  return json({shopName: 'Hydrogen'});
}

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context, params}) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Please provide both an email and a password.',
    });
  }

  const {session, storefront} = context;

  try {
    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `/${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: any) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError:
        'Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.',
    });
  }
};

export const meta: V2_MetaFunction = () => {
  return [{title: 'Login'}];
};

export default function Login() {
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );

  const fetcher = useFetcher();

  return (
    <div className="container pt-[1.9rem] pb-[120px]">
      <div className="flex gap-[50px] flex-col lg:flex-row">
        <Global.CardImage
          image={image}
          title="Albert Flores"
          descripton="Sit ac tortor orci tellus semper elit. Pretium urna tincidunt ornare ipsum magna facilisi."
        />
        {/* TODO: Add onSubmit to validate _before_ submission with native? */}
        <div className="flex flex-col flex-auto lg:mt-[20px]">
          <h1>Login Your Account</h1>
          <p className="max-w-[594px] font-sledge-font-family-1 text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-sledge-color-text-secondary-1">
            Sed at vitae viverra vitae sagittis nibh. Tellus odio congue nulla
            rhoncus sagittis vitae arcu. Ullamcorper elementum est ipsum sed
            gravida.
          </p>
          <fetcher.Form
            method="post"
            noValidate
            className="mt-[20px] md:mt-[40px] gap-[25px] md:gap-[40px] flex flex-col max-w-[550px]"
          >
            {fetcher.data?.formError && (
              <div className="flex items-center justify-center mb-6 bg-zinc-500">
                <p className="m-4 text-s text-contrast">
                  {fetcher.data.formError}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2 mb-[12px]">
              <Global.Input
                label="Email"
                type="email"
                className={`${getInputStyleClasses(nativeEmailError)}`}
                name="email"
                placeholder='Email "example@gmail.com"'
                width={'full'}
                onBlur={(event: any) => {
                  setNativeEmailError(
                    event.currentTarget.value.length &&
                      !event.currentTarget.validity.valid
                      ? 'Invalid email address'
                      : null,
                  );
                }}
              />
              {nativeEmailError && (
                <p className="text-red-500 text-xs">{nativeEmailError} </p>
              )}
              <Global.Input
                label="Password"
                className={`${getInputStyleClasses(nativePasswordError)}`}
                type="password"
                name="password"
                placeholder="Password"
                width={'full'}
                onBlur={(event: any) => {
                  if (
                    event.currentTarget.validity.valid ||
                    !event.currentTarget.value.length
                  ) {
                    setNativePasswordError(null);
                  } else {
                    setNativePasswordError(
                      event.currentTarget.validity.valueMissing
                        ? 'Please enter a password'
                        : 'Passwords must be at least 8 characters',
                    );
                  }
                }}
              />
              {nativePasswordError && (
                <p className="text-red-500 text-xs"> {nativePasswordError}</p>
              )}
              <Link
                to="/account/recover"
                className="font-sledge-font-family-1 text-[14px] leading-[22px] tracking-[-0.02em] w-max"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
              <p className="w-fit text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-[--sledge-color-text-secondary-1]">
                Dont have an account?
                <Link
                  to="/account/register"
                  className="!text-[--sledge-color-primary-black] ml-2"
                >
                  Sign Up
                </Link>
              </p>
              <Global.Button
                text="Login"
                textColor="text-white"
                color="bg-sledge-color-primary-green-3"
                className="mt-0 !w-fit"
                isArrow={true}
                type={'button'}
                loading={fetcher.state}
                disabledProps={!!(nativePasswordError || nativeEmailError)}
              />
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

const LOGIN_MUTATION = `#graphql
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
  `;

export async function doLogin(
  {storefront}: AppLoadContext,
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
) {
  const data = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  /**
   * Something is wrong with the user's input.
   */
  throw new Error(
    data?.customerAccessTokenCreate?.customerUserErrors.join(', '),
  );
}
