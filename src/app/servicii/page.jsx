import Link from 'next/link';
import { serviceCategories } from '@/data/serviceCategories';
import Script from 'next/script';

export const metadata = {
  title: 'Servicii Profesionale de Reparații și Construcții | Fix Acum',
  description: 'Explorează gama completă de servicii profesionale oferite de Fix Acum în toată România. De la renovări interioare la construcții și amenajări exterioare, suntem experții tăi de încredere.',
  keywords: 'servicii construcții, reparații, renovări, instalații, amenajări, Fix Acum, profesioniști, România',
  openGraph: {
    title: 'Servicii Profesionale de Reparații și Construcții | Fix Acum',
    description: 'Descoperă serviciile noastre de top în construcții și reparații. Calitate garantată în toată România.',
    images: [
      {
        url: 'https://www.fix-acum.ro/images/servicii-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Servicii Fix Acum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicii Profesionale Fix Acum',
    description: 'Servicii de construcții și reparații de înaltă calitate în România.',
    images: ['https://www.fix-acum.ro/images/servicii-twitter-image.jpg'],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Script id="schema-markup" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Fix Acum",
          "url": "https://www.fix-acum.ro",
          "logo": "https://www.fix-acum.ro/images/logo.png",
          "description": "Servicii profesionale de reparații și construcții în toată România",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "RO"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-XXX-XXX-XXX",
            "contactType": "customer service"
          },
          "sameAs": [
            "https://www.facebook.com/fixacum",
            "https://www.instagram.com/fixacum"
          ]
        })}
      </Script>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Categorii de Servicii Profesionale Fix Acum</h1>
        <p className="text-lg mb-8">
          Descoperă gama noastră completă de servicii profesionale în domeniul construcțiilor și reparațiilor. 
          La Fix Acum, ne mândrim cu expertiză în multiple domenii, oferind soluții personalizate pentru nevoile tale.
        </p>
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
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">De ce să alegi Fix Acum pentru serviciile tale?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Profesioniști cu experiență în toate domeniile construcțiilor și reparațiilor</li>
            <li>Servicii personalizate adaptate nevoilor tale specifice</li>
            <li>Acoperire națională cu experți locali în fiecare regiune</li>
            <li>Garanție pentru toate lucrările efectuate</li>
            <li>Prețuri competitive și transparente</li>
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Contactează-ne pentru o ofertă personalizată</h2>
          <p>
            Suntem aici pentru a-ți oferi soluții profesionale pentru orice proiect de construcții sau reparații. 
            <Link href="/contact" className="text-blue-600 hover:underline ml-1">
              Contactează-ne astăzi
            </Link> pentru o consultație gratuită și o ofertă adaptată nevoilor tale.
          </p>
        </section>
      </div>
    </>
  );
}
