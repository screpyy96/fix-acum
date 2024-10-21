// src/components/GooglePlacesAutocomplete.js
import React, { useEffect, useRef } from 'react';

const GooglePlacesAutocomplete = ({ onSelect }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        onSelect(place);
      });
    }
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="w-full p-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Introduceți adresa"
    />
  );
};

export default GooglePlacesAutocomplete;

