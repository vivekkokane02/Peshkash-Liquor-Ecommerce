/**
 * DigiLocker integration stub.
 * ---------------------------------------------------------------
 * THIS IS A MOCK. It simulates the shape of a real DigiLocker
 * "Partner API" identity-verification flow so the UI and app
 * logic can be built and tested end to end.
 *
 * To go live you must:
 *   1. Register as a Requester/Partner entity on the DigiLocker
 *      Partner Portal (https://partners.digilocker.gov.in) and
 *      get your use case (age/ID verification for regulated
 *      goods) approved.
 *   2. Receive a client_id / client_secret and complete their
 *      OAuth2 + eKYC (or "Pull Document" / "Verify" API) setup.
 *   3. Replace the two functions below with real fetch() calls to
 *      DigiLocker's endpoints, per their API docs, from your
 *      BACKEND (never call DigiLocker directly from the browser
 *      with your client secret).
 *   4. Handle consent, redirect URIs, and token exchange server-side.
 *
 * Nothing below talks to any real government system.
 */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestDigiLockerConsent(linkedId) {
  await delay(700);
  if (!linkedId || linkedId.trim().length < 4) {
    throw new Error('Enter a valid DigiLocker-linked mobile number or ID.');
  }
  // A real integration returns a transaction id after the user
  // consents on DigiLocker's own consent screen (redirect flow).
  return { txnId: `mock-txn-${Date.now()}` };
}

export async function verifyDigiLockerOtp(txnId, otp) {
  await delay(900);
  if (!txnId) throw new Error('Session expired. Start verification again.');
  if (!/^\d{6}$/.test(otp)) {
    return { success: false };
  }
  // Mock success payload shaped like a real eKYC response.
  const mockDob = '1998-04-12';
  const age = calculateAge(mockDob);
  return {
    success: true,
    name: 'Verified User',
    dob: mockDob,
    docType: 'Aadhaar (via DigiLocker)',
    ageOver21: age >= 21,
  };
}

function calculateAge(dobStr) {
  const dob = new Date(dobStr);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
