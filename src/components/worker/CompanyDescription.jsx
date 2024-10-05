import React from 'react';

const CompanyDescription = () => {
  // Exemplu de date despre companie
  const companyInfo = {
    name: "Exemplu Companie SRL",
    description: "Exemplu Companie SRL este dedicată furnizării de servicii de înaltă calitate în domeniul construcțiilor. Ne mândrim cu echipa noastră de profesioniști care lucrează cu pasiune și dedicare.",
    mission: "Misiunea noastră este de a oferi soluții inovatoare și eficiente pentru clienții noștri, asigurându-ne că fiecare proiect este finalizat la cele mai înalte standarde.",
    vision: "Viziunea noastră este de a deveni lideri în industria construcțiilor, recunoscuți pentru excelența serviciilor noastre și pentru angajamentul față de satisfacția clienților.",
    values: [
      "Integritate",
      "Calitate",
      "Inovație",
      "Colaborare",
      "Responsabilitate"
    ]
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-2xl font-bold mb-4">{companyInfo.name}</h2>
      <p className="mb-4">{companyInfo.description}</p>
      <h3 className="text-xl font-semibold mb-2">Misiune</h3>
      <p className="mb-4">{companyInfo.mission}</p>
      <h3 className="text-xl font-semibold mb-2">Viziune</h3>
      <p className="mb-4">{companyInfo.vision}</p>
      <h3 className="text-xl font-semibold mb-2">Valori</h3>
      <ul className="list-disc list-inside">
        {companyInfo.values.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyDescription;
