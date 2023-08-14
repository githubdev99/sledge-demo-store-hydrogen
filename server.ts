// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {createRequestHandler} from '@remix-run/server-runtime';
import {createStorefrontClient} from '@shopify/hydrogen';
import {HydrogenSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

//Contact Us Form
import {createAdminClient} from '~/lib/createAdminClient';

/**
 * Export a fetch handler in module format.
 */
export default async function (request: Request): Promise {
  try {
    /**
     * This has to be done so messy because process.env can't be destructured
     * and only variables explicitly named are present inside a Vercel Edge Function.
     * See https://github.com/vercel/next.js/pull/31237/files
     */
    const env: Env = {
      SESSION_SECRET: '',
      PUBLIC_STOREFRONT_API_TOKEN: '',
      PUBLIC_STOREFRONT_API_VERSION: '',
      PRIVATE_STOREFRONT_API_TOKEN: '',
      PUBLIC_STORE_DOMAIN: '',
      PRIVATE_ADMIN_API_TOKEN: '',
      PRIVATE_ADMIN_API_VERSION: '',
      USE_DUMMY_DATA: '',
      SLEDGE_API_KEY: '',
      SLEDGE_INSTANT_SEARCH_API_KEY: '',
    };
    env.SESSION_SECRET = process.env.SESSION_SECRET;
    env.PUBLIC_STOREFRONT_API_TOKEN = process.env.PUBLIC_STOREFRONT_API_TOKEN;
    env.PRIVATE_STOREFRONT_API_TOKEN = process.env.PRIVATE_STOREFRONT_API_TOKEN;
    env.PUBLIC_STOREFRONT_API_VERSION =
      process.env.PUBLIC_STOREFRONT_API_VERSION;
    env.PUBLIC_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
    env.PRIVATE_ADMIN_API_TOKEN = process.env.PRIVATE_ADMIN_API_TOKEN;
    env.PRIVATE_ADMIN_API_VERSION = process.env.PRIVATE_ADMIN_API_VERSION;
    env.USE_DUMMY_DATA = process.env.USE_DUMMY_DATA;
    env.SLEDGE_API_KEY = process.env.SLEDGE_API_KEY;
    env.SLEDGE_INSTANT_SEARCH_API_KEY =
      process.env.SLEDGE_INSTANT_SEARCH_API_KEY;
    /**
     * Open a cache instance in the worker and a custom session instance.
     */
    if (!env?.SESSION_SECRET) {
      throw new Error('SESSION_SECRET process.environment variable is not set');
    }

    const [session] = await Promise.all([
      HydrogenSession.init(request, [process.env.SESSION_SECRET]),
    ]);

    /**
     * Create Hydrogen's Storefront client.
     */
    const {storefront} = createStorefrontClient({
      buyerIp: request.headers.get('x-forwarded-for') ?? undefined,
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2023-01',
      // storefrontId: process.env.PUBLIC_STOREFRONT_ID,
      // requestGroupId: request.headers.get('request-id'),
    });

    /**
     * Create Hydrogen's Admin API client.
     */
    const {admin} = createAdminClient({
      privateAdminToken: env.PRIVATE_ADMIN_API_TOKEN,
      storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
      adminApiVersion: env.PRIVATE_ADMIN_API_VERSION || '2023-01',
    });

    const handleRequest = createRequestHandler(remixBuild as any, 'production');

    const response = await handleRequest(request, {
      session,
      storefront,
      env,
      admin,
      waitUntil: () => Promise.resolve(),
    });

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      // return storefrontRedirect({request, response, storefront});
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
