// src/components/hero/steps/location.js
import React from 'react';
import { useForm } from '@/context/FormProvider';
import { motion } from 'framer-motion';
import CustomLocationInput from '@/components/googlePlaces/customLocation';

const Step2Location = () => {
  const { formData, handleInputChange, nextStep } = useForm();

  const handleLocationSelect = (location) => {
    handleInputChange('location', 'address', location.description);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.location && formData.location.address) {
      nextStep();
    } else {
      alert('Vă rugăm să selectați o locație validă.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Locația Jobului</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresă sau Cod Poștal</label>
          <CustomLocationInput 
            onSelect={handleLocationSelect} 
            initialValue={formData.location?.address || ''}
          />
        </div>
        {formData.location && formData.location.address && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Locație selectată:</p>
            <p className="font-medium">{formData.location.address}</p>
          </div>
        )}
        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continuă
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Step2Location;
