// src/components/CustomLocationInput.js
import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CustomLocationInput = ({ onSelect, initialValue }) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    setInputValue(initialValue || '');
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSelect({ description: value }); // Actualizează valoarea în părinte la fiecare modificare

    if (value.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        { input: value, componentRestrictions: { country: 'ro' } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (placeId, description) => {
    setInputValue(description);
    setSuggestions([]);
    onSelect({ placeId, description });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onSelect({ description: inputValue, isManual: true });
    setShowManualInput(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Introduceți adresa sau codul poștal"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionSelect(suggestion.place_id, suggestion.description)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {!showManualInput && (
        <button
          type="button"
          onClick={() => setShowManualInput(true)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Nu găsiți locația? Introduceți manual
        </button>
      )}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Introduceți manual adresa sau comuna"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Confirmă adresa
          </button>
        </form>
      )}
    </div>
  );
};

export default CustomLocationInput;
