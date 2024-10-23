const serviceCategories = [
  {
    id: 'renovari-interioare',
    name: 'Renovări Interioare',
    subcategories: [
      { id: 'zugravit', name: 'Zugrăvit' },
      { id: 'tencuiala', name: 'Tencuială' },
      { id: 'gresie-faianta', name: 'Montaj gresie și faianță' },
      { id: 'parchet', name: 'Montaj parchet' },
      { id: 'tamplar', name: 'Tâmplărie' },
      { id: 'rigips', name: 'Montaj rigips' },
      { id: 'izolatie-termica', name: 'Izolație termică' },
      { id: 'vopsitorie', name: 'Vopsitorie decorativă' },
      { id: 'tavane-false', name: 'Montaj tavane false' },
      { id: 'amenajari-poduri', name: 'Amenajări poduri' },
      { id: 'montaj-usi', name: 'Montaj uși interioare' },
      { id: 'montaj-ferestre', name: 'Montaj ferestre' },
      { id: 'design-interior', name: 'Design interior' }
    ]
  },
  {
    id: 'instalatii',
    name: 'Instalații',
    subcategories: [
      { id: 'electrice', name: 'Instalații electrice' },
      { id: 'sanitare', name: 'Instalații sanitare' },
      { id: 'termice', name: 'Instalații termice' },
      { id: 'gaz', name: 'Instalații de gaz' },
      { id: 'ventilatie', name: 'Sisteme de ventilație' },
      { id: 'aer-conditionat', name: 'Montaj aer condiționat' },
      { id: 'panouri-solare', name: 'Instalare panouri solare' },
      { id: 'pompe-caldura', name: 'Instalare pompe de căldură' },
      { id: 'sisteme-incalzire', name: 'Sisteme de încălzire în pardoseală' },
      { id: 'automatizari', name: 'Automatizări pentru casă' }
    ]
  },
  {
    id: 'constructii',
    name: 'Construcții',
    subcategories: [
      { id: 'zidarie', name: 'Zidărie' },
      { id: 'fundatii', name: 'Fundații' },
      { id: 'acoperisuri', name: 'Acoperișuri' },
      { id: 'structuri-metalice', name: 'Structuri metalice' },
      { id: 'consolidari', name: 'Consolidări clădiri' },
      { id: 'demolari', name: 'Demolări controlate' },
      { id: 'case-lemn', name: 'Construcții case din lemn' },
      { id: 'case-pasive', name: 'Construcții case pasive' },
      { id: 'izolatii-hidro', name: 'Izolații hidroizolante' },
      { id: 'constructii-industriale', name: 'Construcții industriale' }
    ]
  },
  {
    id: 'exterioare',
    name: 'Amenajări Exterioare',
    subcategories: [
      { id: 'gradinarit', name: 'Grădinărit' },
      { id: 'piscine', name: 'Construcție și întreținere piscine' },
      { id: 'peisagistica', name: 'Amenajare peisagistică' },
      { id: 'pavaje', name: 'Pavaje și alei' },
      { id: 'terase', name: 'Construcție terase' },
      { id: 'garduri', name: 'Montaj garduri și porți' },
      { id: 'irigatie', name: 'Sisteme de irigație' },
      { id: 'iluminat-exterior', name: 'Iluminat exterior' },
      { id: 'foisoare', name: 'Construcție foisoare și pergole' },
      { id: 'drenaj-teren', name: 'Drenaj teren' }
    ]
  },
  {
    id: 'servicii-specializate',
    name: 'Servicii Specializate',
    subcategories: [
      { id: 'proiectare', name: 'Servicii de proiectare' },
      { id: 'expertize-tehnice', name: 'Expertize tehnice' },
      { id: 'topografie', name: 'Servicii topografice' },
      { id: 'dezinsectie', name: 'Dezinsecție și deratizare' },
      { id: 'curatenie-profesionala', name: 'Curățenie profesională' },
      { id: 'transport-materiale', name: 'Transport materiale construcții' },
      { id: 'inchirieri-utilaje', name: 'Închirieri utilaje construcții' },
      { id: 'restaurari', name: 'Restaurări clădiri istorice' },
      { id: 'alpinism-utilitar', name: 'Alpinism utilitar' },
      { id: 'audit-energetic', name: 'Audit energetic' }
    ]
  },
  {
    id: 'finisaje',
    name: 'Finisaje',
    subcategories: [
      { id: 'tapet', name: 'Montaj tapet' },
      { id: 'mocheta', name: 'Montaj mochetă' },
      { id: 'sticla', name: 'Prelucrare și montaj sticlă' },
      { id: 'piatra-naturala', name: 'Montaj piatră naturală' },
      { id: 'scari', name: 'Construcție și finisaj scări' },
      { id: 'balustrade', name: 'Montaj balustrade' },
      { id: 'placari-exterioare', name: 'Placări exterioare' },
      { id: 'pardoseli-epoxidice', name: 'Pardoseli epoxidice' },
      { id: 'sape', name: 'Turnare șape' },
      { id: 'profile-decorative', name: 'Montaj profile decorative' }
    ]
  },
  {
    id: 'reparatii-intretinere',
    name: 'Reparații și Întreținere',
    subcategories: [
      { id: 'reparatii-acoperis', name: 'Reparații acoperiș' },
      { id: 'desfundare-canalizare', name: 'Desfundare canalizare' },
      { id: 'reparatii-electrocasnice', name: 'Reparații electrocasnice' },
      { id: 'reparatii-termopane', name: 'Reparații termopane' },
      { id: 'intretinere-centrale', name: 'Întreținere centrale termice' },
      { id: 'reparatii-mobila', name: 'Reparații mobilă' },
      { id: 'curatare-cosuri', name: 'Curățare coșuri fum' },
      { id: 'reparatii-electronice', name: 'Reparații electronice' },
      { id: 'mentenanta-cladiri', name: 'Mentenanță clădiri' },
      { id: 'reparatii-usi-garaj', name: 'Reparații uși de garaj' }
    ]
  }
];

const allTrades = serviceCategories.flatMap(category => 
  category.subcategories.map(subcat => subcat.name)
);

module.exports = {
  serviceCategories,
  allTrades
};
