import React from 'react';
import { FaClipboardCheck, FaUserCheck, FaTools, FaThumbsUp } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Pasul 1: Consultare',
    description: 'Contactați-ne pentru a discuta despre nevoile dumneavoastră.',
    icon: <FaClipboardCheck className="h-8 w-8 text-blue-600" />,
  },
  {
    id: 2,
    title: 'Pasul 2: Evaluare',
    description: 'Echipa noastră va evalua cerințele și va oferi o soluție personalizată.',
    icon: <FaUserCheck className="h-8 w-8 text-blue-600" />,
  },
  {
    id: 3,
    title: 'Pasul 3: Execuție',
    description: 'Serviciile vor fi executate de profesioniști calificați.',
    icon: <FaTools className="h-8 w-8 text-blue-600" />,
  },
  {
    id: 4,
    title: 'Pasul 4: Feedback',
    description: 'După finalizare, vă vom solicita feedback pentru a ne îmbunătăți serviciile.',
    icon: <FaThumbsUp className="h-8 w-8 text-blue-600" />,
  },
];

const HowOurServiceWorks = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Cum funcționează serviciile noastre</h2>
      <p className="text-center mb-10 text-gray-600">
        Urmați acești pași simpli pentru a beneficia de serviciile noastre de calitate.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map(step => (
          <div key={step.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-500 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowOurServiceWorks;