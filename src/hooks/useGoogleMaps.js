// src/hooks/useGoogleMaps.js
import { useState, useEffect } from 'react';

const useGoogleMaps = () => {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google && !document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = () => {
        setGoogleMapsLoaded(true);
      };

      return () => {
        document.head.removeChild(script);
      };
    } else if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
    }
  }, []);

  return googleMapsLoaded;
};

export default useGoogleMaps;
