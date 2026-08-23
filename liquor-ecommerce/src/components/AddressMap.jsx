import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMaps, isGoogleMapsConfigured } from '../utils/googleMaps.js';

/**
 * Interactive "delivery location" picker.
 *
 * If VITE_GOOGLE_MAPS_API_KEY is configured, this renders a real,
 * draggable Google Map with a search box (Places Autocomplete) and
 * reverse geocoding, and calls onLocationChange with:
 *   { formattedAddress, city, pincode, lat, lng }
 *
 * If no key is configured, it renders a lightweight fallback: a
 * "Use my current location" button (plain browser Geolocation) plus
 * a static, key-free map preview, so the checkout flow still works.
 */
export default function AddressMap({ onLocationChange }) {
  const mapConfigured = isGoogleMapsConfigured();
  return mapConfigured ? (
    <LiveGoogleMap onLocationChange={onLocationChange} />
  ) : (
    <FallbackLocationPicker onLocationChange={onLocationChange} />
  );
}

function LiveGoogleMap({ onLocationChange }) {
  const mapDivRef = useRef(null);
  const searchInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');

  const applyPlace = useCallback(
    (lat, lng, formattedAddress, components) => {
      const getComp = (type) =>
        components?.find((c) => c.types.includes(type))?.long_name || '';

      const city =
        getComp('locality') || getComp('postal_town') || getComp('administrative_area_level_2');
      const pincode = getComp('postal_code');

      setAddress(formattedAddress || '');
      onLocationChange?.({
        formattedAddress: formattedAddress || '',
        city,
        pincode,
        lat,
        lng,
      });
    },
    [onLocationChange]
  );

  const reverseGeocode = useCallback(
    (lat, lng) => {
      if (!geocoderRef.current) return;
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          applyPlace(lat, lng, results[0].formatted_address, results[0].address_components);
        } else {
          applyPlace(lat, lng, '', []);
        }
      });
    },
    [applyPlace]
  );

  const moveMarker = useCallback(
    (lat, lng) => {
      const position = { lat, lng };
      markerRef.current.position
        ? (markerRef.current.position = position) // AdvancedMarkerElement
        : markerRef.current.setPosition(position); // legacy Marker
      mapRef.current.panTo(position);
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled) return;

        const defaultCenter = { lat: 19.076, lng: 72.8777 }; // Mumbai fallback center
        const lightMode = document.documentElement.classList.contains('theme-light');

        const map = new maps.Map(mapDivRef.current, {
          center: defaultCenter,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined,
          styles: [
            { elementType: 'geometry', stylers: [{ color: lightMode ? '#F1ECE4' : '#16131A' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: lightMode ? '#F7F4EE' : '#0B0A0C' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: lightMode ? '#665F56' : '#8B8680' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: lightMode ? '#FFFFFF' : '#1E1A22' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: lightMode ? '#D7E5E8' : '#0B0A0C' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          ],
        });

        const marker = new maps.Marker({
          position: defaultCenter,
          map,
          draggable: true,
        });

        marker.addListener('dragend', (e) => {
          moveMarker(e.latLng.lat(), e.latLng.lng());
        });

        map.addListener('click', (e) => {
          moveMarker(e.latLng.lat(), e.latLng.lng());
        });

        mapRef.current = map;
        markerRef.current = marker;
        geocoderRef.current = new maps.Geocoder();

        if (searchInputRef.current) {
          const autocomplete = new maps.places.Autocomplete(searchInputRef.current, {
            fields: ['geometry', 'formatted_address', 'address_components'],
          });
          autocomplete.bindTo('bounds', map);
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            marker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
            map.setZoom(16);
            applyPlace(lat, lng, place.formatted_address, place.address_components);
          });
        }

        // Try to center on the user's current location right away.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              map.setCenter({ lat: latitude, lng: longitude });
              marker.setPosition({ lat: latitude, lng: longitude });
              reverseGeocode(latitude, longitude);
            },
            () => {
              /* user denied or unavailable — keep default center */
            },
            { timeout: 5000 }
          );
        }

        setStatus('ready');
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      moveMarker(latitude, longitude);
    });
  };

  if (status === 'error') {
    return <FallbackLocationPicker onLocationChange={onLocationChange} loadError={error} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] uppercase tracking-widest2 text-stone">
          Delivery Location
        </label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="text-[10px] uppercase tracking-widest2 text-gold hover:text-goldSoft transition-colors"
        >
          Use my current location
        </button>
      </div>

      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search for your address…"
        className="w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
      />

      <div
        ref={mapDivRef}
        className="w-full h-56 border border-white/15 bg-surface2"
        aria-label="Map showing selected delivery location"
      />

      {status === 'loading' && <p className="text-xs text-stone">Loading map…</p>}
      {address && <p className="text-xs text-stone">Pinned: {address}</p>}
      <p className="text-[10px] text-stone/70">
        Drag the pin, click the map, or search above to set your exact delivery point.
      </p>
    </div>
  );
}

function FallbackLocationPicker({ onLocationChange, loadError }) {
  const [manualAddress, setManualAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocating(false);
        onLocationChange?.({
          formattedAddress: manualAddress,
          city: '',
          pincode: '',
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => {
        setGeoError(err.message || 'Could not get your location.');
        setLocating(false);
      }
    );
  };

  const handleAddressBlur = () => {
    onLocationChange?.({
      formattedAddress: manualAddress,
      city: '',
      pincode: '',
      lat: coords?.lat,
      lng: coords?.lng,
    });
  };

  const previewSrc = manualAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(manualAddress)}&output=embed`
    : coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] uppercase tracking-widest2 text-stone">
          Delivery Location
        </label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="text-[10px] uppercase tracking-widest2 text-gold hover:text-goldSoft transition-colors disabled:opacity-60"
        >
          {locating ? 'Locating…' : 'Use my current location'}
        </button>
      </div>

      <input
        type="text"
        value={manualAddress}
        onChange={(e) => setManualAddress(e.target.value)}
        onBlur={handleAddressBlur}
        placeholder="Type your address to preview it on the map…"
        className="w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
      />

      {previewSrc ? (
        <iframe
          title="Delivery location preview"
          src={previewSrc}
          className="w-full h-56 border border-white/15"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-56 border border-white/15 bg-surface2 flex items-center justify-center text-center px-6">
          <p className="text-xs text-stone">
            Enter an address or tap "Use my current location" to preview the map here.
          </p>
        </div>
      )}

      {geoError && <p className="text-xs text-burgundy">{geoError}</p>}
      {loadError && (
        <p className="text-[10px] text-stone/70">
          Interactive map unavailable ({loadError}). Showing a lightweight preview instead.
        </p>
      )}
      {!loadError && (
        <p className="text-[10px] text-stone/70">
          Add VITE_GOOGLE_MAPS_API_KEY to enable the full interactive map with drag-to-pin and
          address autocomplete.
        </p>
      )}
    </div>
  );
}
