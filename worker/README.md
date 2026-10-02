# Pesapal Cloudflare Worker

Deploy from this directory:

```sh
npx wrangler deploy
```

Configure these Production secrets in Cloudflare:

- `PESAPAL_CONSUMER_KEY`
- `PESAPAL_CONSUMER_SECRET`
- `PESAPAL_IPN_ID`

Configure these Production variables:

- `PESAPAL_ENV`: `sandbox` or `production`
- `WORKER_URL`: the deployed Worker URL
- `FRONTEND_URL`: the deployed website URL
- `FIREBASE_API_KEY`: the Firebase web API key

The frontend sends a Firebase ID token to `/create-payment`. The Worker validates
the token through Firebase Authentication before creating a Pesapal order.
