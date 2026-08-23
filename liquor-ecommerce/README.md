# Reserve — Liquor E-Commerce Starter

React + Vite + Tailwind CSS with real product photography, backed by an
Express + MongoDB API for the product catalog.

## Run it

**1. Backend (`/server`) — start this first, the frontend catalog needs it:**

```bash
cd server
npm install
cp .env.example .env      # set MONGODB_URI to your Atlas/local connection string
npm run seed               # loads the 8 starter products into MongoDB (run once)
npm run dev                 # starts on http://localhost:5000
```

**2. Frontend (this folder):**

```bash
npm install
cp .env.example .env   # add your Google Maps API key (see below) and confirm VITE_API_URL
npm run dev
```

Open http://localhost:5173

Build for production:

```bash
npm run build
npm run preview
```

## Backend API

Base URL: `http://localhost:5000/api` (see `server/.env.example` for `PORT`/`CLIENT_URL`/rate-limit config).

| Method | Endpoint             | Purpose                                    |
| ------ | --------------------- | ------------------------------------------- |
| POST   | `/api/products`       | Create a product                            |
| GET    | `/api/products`       | List products (pagination, search, filter, sort) |
| GET    | `/api/products/:id`   | Get one product                             |
| PATCH  | `/api/products/:id`   | Update a product (partial)                  |
| DELETE | `/api/products/:id`   | Soft-delete a product                       |
| GET    | `/health`             | Health check for deployment platforms       |

List query params: `page`, `limit` (max 100), `search`, `category`, `sort` (e.g. `-createdAt`, `price`), `minPrice`, `maxPrice`.

Every response is shaped as `{ success, message, data, meta? }` on success or
`{ success: false, message, error: { code, details? } }` on failure — see
`server/src/middleware/errorHandler.js`.

Run backend tests: `cd server && npm test` (uses an in-memory MongoDB, no real DB needed for tests).

**Not yet built:** authentication/authorization on these routes (there's no
user login system in this project yet, so anyone who can reach the API can
write to the catalog), and an Orders resource (checkout is still a UI-only
simulation). Both are natural next steps once you're ready for them.

## What's included

- Age-gate splash screen (session-based)
- Product catalog with real bottle photography and responsive image loading
- "DigiLocker" identity/age verification flow — **mocked**, see below
- Cart (context-based, add/remove/update quantity)
- Checkout flow with a delivery form and order summary
- Interactive Google Map for picking the delivery address (search,
  drag-to-pin, "use my location", reverse geocoding) — **real, just needs
  your API key**, see below
- Checkout payment method picker: Google Pay, other UPI apps, cards,
  netbanking, wallets, and Cash on Delivery — **mocked**, see below
- Fully responsive, keyboard-focus visible, respects reduced-motion

## Google Maps setup

`src/components/AddressMap.jsx` renders a real, interactive Google Map at
checkout so shoppers can search for or drag-pin their exact delivery
location, with reverse geocoding auto-filling address/city/pincode.

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an API key.
2. Enable **Maps JavaScript API** and **Places API** for that key.
3. Restrict the key to your site's domain (HTTP referrers) before going live.
4. `cp .env.example .env` and set `VITE_GOOGLE_MAPS_API_KEY=your_key_here`.
5. Restart `npm run dev`.

If no key is configured, checkout automatically falls back to a manual
address field with a key-free static map preview and a "use my location"
button, so the app still runs out of the box.

## Payment methods

`src/components/PaymentMethods.jsx` + `src/utils/paymentApi.js` implement
the full checkout UI for Google Pay, UPI, cards, netbanking, wallets, and
Cash on Delivery — **mocked**, same pattern as the DigiLocker stub below.
Any details you enter simulate a successful payment after a short delay;
no real gateway or money movement is involved.

To go live:

- Sign up with an aggregator that supports Google Pay + UPI + cards +
  netbanking + wallets in a single integration (e.g. Razorpay, Cashfree,
  PayU). Their hosted checkout widget already renders all of these tabs
  for you.
- Create the payment **order** on your backend using your secret key —
  never put a gateway secret key in frontend code.
- Load the gateway's checkout script on the frontend and open it with the
  `order_id` your backend returned.
- Verify the payment signature server-side before marking an order paid.
- Replace `createPaymentOrder` / `processPayment` in `paymentApi.js` with
  calls to your backend.

## ⚠️ Before you launch this for real

**1. Alcohol sale licensing.** Selling liquor online is tightly regulated and
varies by state/country. In India, this generally requires an excise
license and, in most states, you cannot legally sell alcohol via a
general e-commerce site at all — check your state's excise department
rules before operating this as a live store. This project is a
technical starting point, not a compliance solution.

**2. DigiLocker is mocked.** `src/utils/digilockerApi.js` simulates the
shape of a real verification flow (consent → OTP → age check) so you can
build and demo the UI. To use the real DigiLocker Partner API you need to:

- Register as a partner at https://partners.digilocker.gov.in
- Get your use case (age/ID verification for regulated goods) approved
- Receive OAuth2 client credentials
- Do the actual token exchange **server-side** — never call DigiLocker
  or store its client secret in frontend code
- Replace the two functions in `digilockerApi.js` with calls to your
  own backend, which in turn calls DigiLocker

In the demo, any 6-digit number is accepted as a valid OTP, and it will
tell you that you're verified. This is for UI testing only.

## Project structure

```
src/
  components/   Navbar, Footer, ProductCard, ProductImage,
                CartDrawer, AgeGateModal, DigiLockerAuth
  pages/        Home, ProductDetail, Checkout, OrderSuccess
  context/      CartContext, AuthContext
  data/         products.js (sample catalog — replace with real data/API)
  utils/        digilockerApi.js (mock — see warning above)
```

## Product photography

Product image URLs live in `src/data/products.js` and are rendered by
`src/components/ProductImage.jsx`. Replace those URLs with your own
licensed bottle photography or local assets before launch.
