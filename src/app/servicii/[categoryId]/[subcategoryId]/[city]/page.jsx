import { serviceCategories } from '@/data/serviceCategories';
import citiesData from '@/data/cities.json';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === params.subcategoryId);
  const city = decodeURIComponent(params.city);

  return {
    title: `${subcategory?.name} în ${city} | Servicii Profesionale | Fix Acum`,
    description: `Găsiți profesioniști de încredere pentru ${subcategory?.name.toLowerCase()} în ${city}. Servicii de calitate, prețuri competitive. Contactați-ne astăzi pentru o ofertă personalizată!`,
    openGraph: {
      title: `${subcategory?.name} în ${city} | Fix Acum`,
      description: `Servicii profesionale de ${subcategory?.name.toLowerCase()} în ${city}. Calitate garantată, prețuri competitive.`,
      images: [{ url: `/images/${subcategory?.id}.jpg`, width: 1200, height: 630, alt: `${subcategory?.name} în ${city}` }],
    },
  };
}

export default function CityServicePage({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === params.subcategoryId);
  const city = decodeURIComponent(params.city);

  const cityExists = citiesData.cities.some(c => c.toLowerCase() === city.toLowerCase());

  if (!category || !subcategory || !cityExists) {
    return <div>Pagina nu a fost găsită</div>;
  }

  // Definim jsonLd în interiorul componentei
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${subcategory.name} în ${city}`,
    description: `Servicii profesionale de ${subcategory.name.toLowerCase()} în ${city}. Calitate garantată, prețuri competitive.`,
    provider: {
      '@type': 'Organization',
      name: 'Fix Acum',
      url: 'https://www.fixacum.ro'
    },
    areaServed: {
      '@type': 'City',
      name: city
    },
    // Adăugați mai multe proprietăți relevante
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{subcategory.name} în {city}</h1>
        
        {/* <div className="mb-8">
          <Image 
            src={`/images/${subcategory.id}-${city.toLowerCase()}.jpg`} 
            alt={`${subcategory.name} în ${city}`}
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div> */}

        <p className="text-xl mb-4">
          Aveți nevoie de servicii profesionale de {subcategory.name.toLowerCase()} în {city}? 
          Fix Acum vă conectează cu cei mai buni specialiști din domeniul {category.name.toLowerCase()} din {city}.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">De ce să alegeți Fix Acum pentru {subcategory.name} în {city}?</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>Profesioniști locali verificați și de încredere</li>
          <li>Servicii de calitate adaptate nevoilor din {city}</li>
          <li>Prețuri competitive pentru piața locală</li>
          <li>Suport rapid și eficient pentru clienții din {city}</li>
          <li>Garanție pentru lucrările efectuate</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Servicii de {subcategory.name} oferite în {city}</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>Evaluare și consultanță gratuită</li>
          <li>Planificare detaliată a proiectului</li>
          <li>Execuție profesională a lucrărilor</li>
          <li>Utilizarea materialelor de înaltă calitate</li>
          <li>Curățenie post-intervenție</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Întrebări frecvente despre {subcategory.name} în {city}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Cât costă serviciile de {subcategory.name.toLowerCase()} în {city}?</h3>
            <p>Prețurile variază în funcție de complexitatea proiectului. Contactați-ne pentru o evaluare gratuită și o ofertă personalizată.</p>
          </div>
          <div>
            <h3 className="font-semibold">Cât durează un proiect tipic de {subcategory.name.toLowerCase()}?</h3>
            <p>Durata depinde de amploarea lucrării. Vă vom oferi o estimare detaliată după evaluarea proiectului.</p>
          </div>
          {/* Adăugați mai multe întrebări frecvente */}
        </div>

        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Solicitați o ofertă pentru {subcategory.name} în {city}</h2>
          <p className="mb-4">Completați formularul nostru online sau sunați-ne pentru a primi o ofertă personalizată pentru proiectul dumneavoastră.</p>
          <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Contactați-ne acum
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Alte servicii în {city}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {category.subcategories.filter(sub => sub.id !== subcategory.id).map(sub => (
              <li key={sub.id}>
                <Link href={`/servicii/${category.id}/${sub.id}/${encodeURIComponent(city)}`} className="text-blue-600 hover:underline">
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}