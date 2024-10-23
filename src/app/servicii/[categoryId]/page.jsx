import { serviceCategories } from '@/data/serviceCategories';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);
  return {
    title: `${category.name} | Fix Acum`,
    description: `Găsiți profesioniști pentru ${category.name.toLowerCase()} în toată România cu Fix Acum.`,
  };
}

export default function CategoryPage({ params }) {
  const category = serviceCategories.find(cat => cat.id === params.categoryId);

  if (!category) {
    return <div>Categoria nu a fost găsită</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories.map((subcat) => (
          <div key={subcat.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              <Link href={`/servicii/${category.id}/${subcat.id}/${encodeURIComponent(city)}`}>
                {subcat.name} în {city}
              </Link>
            </h2>
            <p className="text-gray-600">
              Găsiți profesioniști pentru {subcat.name.toLowerCase()} în zona dumneavoastră.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
