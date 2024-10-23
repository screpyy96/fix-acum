import { serviceCategories } from '@/data/serviceCategories';
import citiesData from '@/data/cities.json';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === params.subcategoryId);
  return {
    title: `${subcategory?.name} în România | ${category?.name} | Fix Acum`,
    description: `Găsiți profesioniști de încredere pentru ${subcategory?.name.toLowerCase()} în toată România. Servicii de calitate în ${category?.name.toLowerCase()} cu Fix Acum.`,
  };
}

export default function SubcategoryPage({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === params.subcategoryId);

  if (!subcategory) {
    return <div>Subcategoria nu a fost găsită</div>;
  }

  // Selectăm primele 10 orașe pentru exemplu
  const cities = citiesData.cities.slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{subcategory.name} în România</h1>
      
      <p className="text-xl mb-4">
        Aveți nevoie de servicii profesionale de {subcategory.name.toLowerCase()}? Fix Acum vă conectează cu cei mai buni specialiști din domeniul {category.name.toLowerCase()} din toată țara.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">De ce să alegeți Fix Acum pentru {subcategory.name}?</h2>
      <ul className="list-disc pl-5 mb-6">
        <li>Profesioniști verificați și de încredere</li>
        <li>Servicii de calitate la prețuri competitive</li>
        <li>Acoperire națională în toate orașele importante</li>
        <li>Proces simplu și rapid de găsire a specialistului potrivit</li>
        <li>Evaluări și recenzii de la clienți anteriori</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Servicii de {subcategory.name} disponibile în principalele orașe:</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cities.map((city) => (
          <Link key={city} href={`/servicii/${category.id}/${subcategory.id}/${encodeURIComponent(city)}`} className="text-blue-600 hover:underline">
            {subcategory.name} în {city}
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Ce include serviciul de {subcategory.name}?</h2>
      <p className="mb-4">
        Serviciile noastre de {subcategory.name.toLowerCase()} acoperă o gamă largă de nevoi, incluzând:
      </p>
      <ul className="list-disc pl-5 mb-6">
        <li>Evaluare inițială și consultanță</li>
        <li>Planificare detaliată a proiectului</li>
        <li>Execuție profesională a lucrărilor</li>
        <li>Utilizarea materialelor și echipamentelor de înaltă calitate</li>
        <li>Respectarea normelor și standardelor în vigoare</li>
        <li>Curățenie post-intervenție</li>
        <li>Garanție pentru lucrările efectuate</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Cum funcționează?</h2>
      <ol className="list-decimal pl-5 mb-6">
        <li>Descrieți proiectul dvs. de {subcategory.name.toLowerCase()}</li>
        <li>Primiți oferte de la profesioniști verificați</li>
        <li>Comparați ofertele și alegeți cel mai potrivit specialist</li>
        <li>Programați și beneficiați de serviciul dorit</li>
        <li>Plătiți doar după ce sunteți mulțumit de rezultat</li>
      </ol>

      <p className="mt-8 text-lg">
        Nu așteptați! Găsiți acum cel mai bun profesionist pentru {subcategory.name.toLowerCase()} în orașul dvs. 
        Completați formularul de cerere sau contactați-ne pentru mai multe informații.
      </p>

      <div className="mt-8">
        <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        Completeaza formularul pentru o consultație gratuită la {subcategory.name}
        </Link>
      </div>
    </div>
  );
}
