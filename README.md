# Safari Dream Weaver

## Local environment

Copy `.env.example` to `.env` and provide the Firebase public web configuration values and the public Pesapal Worker URL.

The `.env` file is intentionally ignored by Git. A local `.env` file is not available to Vercel, so the same `VITE_` variables must be added in the Vercel project settings under **Settings → Environment Variables** for the **Production** environment:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_APP_ID
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_PESAPAL_WORKER_URL
```

After adding or changing a Vercel environment variable, trigger a new deployment. Vite embeds `VITE_` variables during the build; changing them does not update an already deployed bundle.

Never add Pesapal consumer secrets, Firebase service-account credentials, or other private credentials to `VITE_` variables.