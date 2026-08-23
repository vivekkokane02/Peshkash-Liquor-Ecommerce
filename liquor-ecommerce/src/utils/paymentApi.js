/**
 * Payment gateway stub.
 * ---------------------------------------------------------------
 * THIS IS A MOCK, same pattern as digilockerApi.js. It simulates
 * the shape of a real payment-gateway flow (order creation →
 * checkout widget → server-side verification) covering:
 *   - Google Pay (UPI intent)
 *   - Other UPI apps (PhonePe, Paytm, BHIM, generic VPA)
 *   - Credit / debit cards
 *   - Netbanking
 *   - Wallets
 *   - Cash on Delivery
 *
 * To go live with real money movement you must:
 *   1. Sign up with a payment aggregator that supports Google Pay
 *      + UPI + cards + netbanking + wallets in one integration —
 *      e.g. Razorpay, Cashfree, or PayU (all support the Google
 *      Pay for Business flow via UPI intent/collect on web).
 *   2. Create the ORDER on your BACKEND using your secret key
 *      (never expose the secret key in the browser).
 *   3. On the frontend, load the gateway's checkout.js and open it
 *      with the order_id your backend returned. The gateway's
 *      widget already presents Google Pay, UPI, cards, netbanking,
 *      and wallets as tabs — you don't have to build those UIs
 *      yourself in production.
 *   4. Verify the payment signature on your BACKEND before marking
 *      the order paid, and confirm age/ID checks per your alcohol
 *      delivery regulations before dispatch.
 *
 * Nothing below moves any real money.
 */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const PAYMENT_METHODS = [
  { id: 'googlepay', label: 'Google Pay', hint: 'Pay via UPI intent' },
  { id: 'upi', label: 'UPI', hint: 'PhonePe, Paytm, BHIM, or any VPA' },
  { id: 'card', label: 'Card', hint: 'Credit or debit card' },
  { id: 'netbanking', label: 'Netbanking', hint: 'All major banks' },
  { id: 'wallet', label: 'Wallet', hint: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'cod', label: 'Cash on Delivery', hint: 'Pay at the door' },
];

/**
 * Simulates creating a payment order on the backend.
 */
export async function createPaymentOrder({ amount, currency = 'INR' }) {
  await delay(400);
  return {
    orderId: `mock-order-${Date.now()}`,
    amount,
    currency,
  };
}

/**
 * Simulates the gateway checkout step for a given method.
 * Returns a resolved payment result, or throws on "failure".
 */
export async function processPayment({ orderId, method, details }) {
  await delay(1100);

  if (method === 'cod') {
    return { success: true, paymentId: `mock-cod-${orderId}`, method };
  }

  if (method === 'googlepay' || method === 'upi') {
    const vpa = details?.vpa?.trim();
    if (method === 'upi' && (!vpa || !vpa.includes('@'))) {
      throw new Error('Enter a valid UPI ID, e.g. name@bank.');
    }
    return { success: true, paymentId: `mock-upi-${orderId}`, method };
  }

  if (method === 'card') {
    const { number, expiry, cvv } = details || {};
    if (!number || number.replace(/\s/g, '').length < 12) {
      throw new Error('Enter a valid card number.');
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      throw new Error('Enter expiry as MM/YY.');
    }
    if (!cvv || cvv.length < 3) {
      throw new Error('Enter a valid CVV.');
    }
    return { success: true, paymentId: `mock-card-${orderId}`, method };
  }

  if (method === 'netbanking') {
    if (!details?.bank) {
      throw new Error('Select your bank.');
    }
    return { success: true, paymentId: `mock-nb-${orderId}`, method };
  }

  if (method === 'wallet') {
    if (!details?.wallet) {
      throw new Error('Select a wallet.');
    }
    return { success: true, paymentId: `mock-wallet-${orderId}`, method };
  }

  throw new Error('Unsupported payment method.');
}
