import LoadingSpinner from '@/components/LoadingSpinner'
import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('@/components/hero/hero'), {
  loading: () => <LoadingSpinner/>,
})

const Ceva = dynamic(() => import('@/components/services/chestii'), {
  loading: () => <LoadingSpinner/>,
})

export const metadata = {
  title: 'Fix Acum | Platformă pentru antreprenori în construcții din România',
  description: 'Fix Acum ajută muncitorii din construcții să devină antreprenori de succes. Găsește proiecte, gestionează clienți și dezvoltă-ți afacerea în toată România.',
  keywords: 'fix acum, antreprenoriat construcții, lansare afacere construcții, găsire clienți construcții, proiecte construcții România, muncitori independenți',
  openGraph: {
    title: 'Fix Acum - Transformă-te din muncitor în antreprenor în construcții',
    description: 'Platformă dedicată muncitorilor din construcții care vor să-și lanseze propria afacere. Conectăm profesioniști cu proiecte în toată România.',
    url: 'https://fix-acum.ro',
    siteName: 'Fix Acum',
    images: [{ url: 'https://fix-acum.ro/og-image.jpg' }],
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fix Acum - Platformă pentru antreprenori în construcții',
    description: 'Lansează-ți propria afacere în construcții și găsește clienți cu Fix Acum.',
    images: ['https://fix-acum.ro/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://fix-acum.ro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Home() {
  return (
    <main>
      <Hero/>
      <Ceva/>
    </main>
  )
}
