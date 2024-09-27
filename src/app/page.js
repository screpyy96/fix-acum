import Link from 'next/link'
import RecentJobs from '@/components/RecentJobs'
import JobCategories from '@/components/JobCategories'
import PopularWorkers from '@/components/PopularWorkers'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Bine ați venit pe Platforma de Joburi</h1>
      
      <RecentJobs />
      <JobCategories />
      <PopularWorkers />

      <div className="flex gap-4">
        <Link href="/jobs" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Caută Joburi
        </Link>
        <Link href="/workers" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Găsește Muncitori
        </Link>
      </div>
    </main>
  )
}
