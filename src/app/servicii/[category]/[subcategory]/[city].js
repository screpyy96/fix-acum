// pages/servicii/[category]/[subcategory]/[city].js
import { useRouter } from 'next/router';
import { getServiceInfo, getCityInfo, getTestimonials } from '@/lib/data';

export default function ServicePage({ serviceInfo, cityInfo, testimonials }) {
  const router = useRouter();
  const { category, subcategory, city } = router.query;

  return (
    <div>
      <h1>{serviceInfo.name} în {cityInfo.name}</h1>
      <p>{generateDescription(serviceInfo, cityInfo)}</p>
      <LocalStats cityInfo={cityInfo} />
      <TestimonialSection testimonials={testimonials} />
      <FAQ serviceInfo={serviceInfo} cityInfo={cityInfo} />
      {/* Adaugă alte componente aici */}
    </div>
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
  // Generează paths pentru toate combinațiile serviciu-oraș
  // ...
}

