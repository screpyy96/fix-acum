import { getServiceInfo, getCityInfo, getTestimonials } from '@/lib/data';
import { generateDescription, generateFAQ } from '@/lib/contentGenerators';
import LocalStats from '@/components/LocalStats';
import TestimonialSection from '@/components/TestimonialSection';
import ContactForm from '@/components/ContactForm';
import Head from 'next/head';
import Script from 'next/script';

export default function ServicePage({ serviceInfo, cityInfo, testimonials }) {
  const description = generateDescription(serviceInfo, cityInfo);
  const faqItems = generateFAQ(serviceInfo, cityInfo);

  return (
    <>
      <Head>
        <title>{`${serviceInfo.name} în ${cityInfo.name} | Fix Acum`}</title>
        <meta name="description" content={description} />
      </Head>

      <Script id="schema-markup" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${serviceInfo.name} în ${cityInfo.name}`,
          "provider": {
            "@type": "LocalBusiness",
            "name": "Fix Acum",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityInfo.name,
              "addressRegion": cityInfo.county,
              "addressCountry": "RO"
            }
          },
          "areaServed": cityInfo.name,
          "description": description
        })}
      </Script>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{serviceInfo.name} în {cityInfo.name}</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Despre serviciul nostru</h2>
          <p className="text-lg">{description}</p>
        </section>

        <LocalStats cityInfo={cityInfo} />
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">De ce să alegeți Fix Acum pentru {serviceInfo.name} în {cityInfo.name}</h2>
          <ul className="list-disc pl-5">
            <li>Expertiză locală și cunoașterea specificului din {cityInfo.name}</li>
            <li>Echipă profesionistă cu ani de experiență în {serviceInfo.name}</li>
            <li>Materiale de înaltă calitate și tehnologii moderne</li>
            <li>Garanție extinsă pentru toate lucrările efectuate</li>
            <li>Prețuri competitive și transparente</li>
          </ul>
        </section>

        <TestimonialSection testimonials={testimonials} />
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Întrebări frecvente despre {serviceInfo.name} în {cityInfo.name}</h2>
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-medium mb-2">{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contactați-ne pentru o ofertă personalizată</h2>
          <ContactForm service={serviceInfo.name} city={cityInfo.name} />
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const serviceInfo = await getServiceInfo(params.category, params.subcategory);
  const cityInfo = await getCityInfo(params.city);
  const testimonials = await getTestimonials(params.city, params.subcategory);

  return {
    props: { serviceInfo, cityInfo, testimonials },
    revalidate: 3600, // Revalidează la fiecare oră
  };
}

export async function getStaticPaths() {
  // Aici trebuie să implementezi logica pentru generarea tuturor path-urilor posibile
  // Exemplu simplu:
  const paths = [
    { params: { category: 'renovari', subcategory: 'zugravit', city: 'bucuresti' } },
    // Adaugă mai multe combinații aici
  ];

  return { paths, fallback: 'blocking' };
}
