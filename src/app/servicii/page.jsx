import Link from 'next/link';
import { serviceCategories } from '@/data/serviceCategories';

export const metadata = {
  title: 'Servicii | Fix Acum',
  description: 'Explorează toate categoriile de servicii oferite de profesioniștii Fix Acum în toată România.',
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorii de Servicii</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceCategories.map((category) => (
          <div key={category.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              <Link href={`/servicii/${category.id}`} className="text-blue-600 hover:underline">
                {category.name}
              </Link>
            </h2>
            <ul className="space-y-2">
              {category.subcategories.map((subcat) => (
                <li key={subcat.id}>
                  <Link href={`/servicii/${category.id}/${subcat.id}`} className="text-gray-600 hover:text-blue-500">
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
