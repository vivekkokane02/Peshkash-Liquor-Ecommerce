/**
 * Google Maps JS API loader.
 * ---------------------------------------------------------------
 * Loads the Maps JavaScript API (+ Places library) exactly once,
 * using an API key from the environment.
 *
 * Setup:
 *   1. Create a key in Google Cloud Console → APIs & Services →
 *      Credentials. Enable "Maps JavaScript API" and "Places API".
 *   2. Restrict the key to your site's domain (HTTP referrers).
 *   3. Put it in a .env file at the project root:
 *        VITE_GOOGLE_MAPS_API_KEY=your_key_here
 *   4. Restart `npm run dev`.
 *
 * Without a key configured, callers should fall back to the
 * manual address form (see AddressMap.jsx).
 */

let loadPromise = null;

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}

export function isGoogleMapsConfigured() {
  return Boolean(getGoogleMapsApiKey());
}

export function loadGoogleMaps() {
  if (loadPromise) return loadPromise;

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is not configured.'));
  }

  if (window.google?.maps?.places) {
    loadPromise = Promise.resolve(window.google.maps);
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = '__rsvGoogleMapsInit';
    window[callbackName] = () => {
      resolve(window.google.maps);
      delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
