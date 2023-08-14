# Sledge Demo Store Hydrogen

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/offstack/sledge-demo-store.git
   ```
2. Go to Hydrogen directory
   ```sh
   cd hydrogen
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run in your local
   ```js
   npm run dev
   ```

Remember to update `.env` with your shop's domain and Storefront API token!

```ini
#.env template

SESSION_SECRET=""
PUBLIC_STOREFRONT_API_TOKEN=""
PUBLIC_STORE_DOMAIN=""

# Admin Api Token for Contact Us form App
# ref : https://github.com/juanpprieto/hydrogen-contact-form-metaobject

PRIVATE_ADMIN_API_TOKEN=""
PRIVATE_ADMIN_API_VERSION=""

# Using Dummy product data, 0 false, 1 true
USE_DUMMY_DATA=1

# Sledge Api key
SLEDGE_API_KEY=""
SLEDGE_INSTANT_SEARCH_API_KEY=""
```

## Building for production

```bash
npm run build
```

## Vercel Deploy
