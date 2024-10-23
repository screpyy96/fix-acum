// lib/contentGenerators.js
export function generateDescription(serviceInfo, cityInfo) {
  return `Oferim servicii de ${serviceInfo.name} de înaltă calitate în ${cityInfo.name}, 
  adaptate la nevoile specifice ale clienților noștri din această zonă. 
  Cu o populație de ${cityInfo.population} locuitori, ${cityInfo.name} prezintă provocări unice...`;
}

export function generateFAQ(serviceInfo, cityInfo) {
  return [
    {
      question: `Care sunt costurile medii pentru ${serviceInfo.name} în ${cityInfo.name}?`,
      answer: `Costurile pentru ${serviceInfo.name} în ${cityInfo.name} variază în funcție de complexitatea proiectului și materialele folosite. În medie, prețurile pot fi între X și Y lei, dar vă recomandăm să ne contactați pentru o estimare personalizată.`
    },
    {
      question: `Cât timp durează de obicei un proiect de ${serviceInfo.name} în ${cityInfo.name}?`,
      answer: `Durata unui proiect de ${serviceInfo.name} în ${cityInfo.name} depinde de amploarea lucrării. În general, un proiect standard poate dura între X și Y zile lucrătoare. Vom putea oferi o estimare mai precisă după o evaluare la fața locului.`
    },
    {
      question: `Aveți experiență cu proiecte de ${serviceInfo.name} specifice pentru ${cityInfo.name}?`,
      answer: `Da, echipa noastră are o experiență vastă în proiecte de ${serviceInfo.name} în ${cityInfo.name}. Am lucrat la numeroase case și apartamente din zonă, adaptându-ne la stilul arhitectural local și la cerințele specifice ale clienților din această regiune.`
    },
    {
      question: `Ce materiale folosiți pentru ${serviceInfo.name} în ${cityInfo.name}?`,
      answer: `Pentru ${serviceInfo.name} în ${cityInfo.name}, folosim materiale de înaltă calitate, adaptate la condițiile climatice locale. Lucrăm cu furnizori de încredere și putem recomanda cele mai potrivite materiale în funcție de bugetul și preferințele dumneavoastră.`
    },
    {
      question: `Oferiți garanție pentru serviciile de ${serviceInfo.name} în ${cityInfo.name}?`,
      answer: `Da, oferim o garanție standard de X ani pentru serviciile noastre de ${serviceInfo.name} în ${cityInfo.name}. Această garanție acoperă atât manopera, cât și materialele folosite, asigurându-vă că investiția dumneavoastră este protejată pe termen lung.`
    },
    {
      question: `Cum pot programa o consultație pentru ${serviceInfo.name} în ${cityInfo.name}?`,
      answer: `Pentru a programa o consultație pentru ${serviceInfo.name} în ${cityInfo.name}, puteți să ne contactați telefonic la numărul [insert phone number] sau să completați formularul de contact de pe site-ul nostru. Vom răspunde în cel mai scurt timp posibil pentru a stabili o întâlnire convenabilă pentru dumneavoastră.`
    }
  ];
}
