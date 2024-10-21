import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('@/components/hero/hero'), {
  loading: () => <p>Loading...</p>,
})
const HowOurServiceWorks = dynamic(() => import('@/components/services/services'), {
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  return (
    <main>
      <Hero/>
      <HowOurServiceWorks/>
    </main>
  )
}
