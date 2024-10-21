import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext'; // Asigură-te că importul este corect
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function JobList() { // Corectat numele funcției
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Folosește contextul de autentificare corect
  const router = useRouter();

  // Extrage trade din user_metadata
  const userTrade = user?.user_metadata?.trade;

  useEffect(() => {
    const fetchJobs = async () => {
      // Asigură-te că user și userTrade există
      if (!user || !userTrade) {
        setLoading(false);
        setJobs([]);
        return;
      }

      setLoading(true);

      // Interogare Supabase filtrată pe trade-ul userului
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          job_applications (
            worker_id
          )
        `)
        .eq('tradeType', userTrade); // Filtrează joburile pe baza trade-ului

      if (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
        return;
      }

      console.log('Fetched jobs:', data);

      // Filtrăm joburile la care utilizatorul NU a aplicat
      const filteredJobs = data.filter(job => {
        // Verificăm dacă există `job_applications`
        if (!job.job_applications || job.job_applications.length === 0) {
          return true; // Dacă nu există aplicații, jobul este disponibil
        }

        // Verificăm dacă utilizatorul a aplicat la job
        const hasApplied = job.job_applications.some(application => application.worker_id === user.id);
        return !hasApplied; // Returnăm true doar dacă utilizatorul NU a aplicat
      });

      setJobs(filteredJobs);
      setLoading(false);
    };

    fetchJobs();

    // Set up polling to fetch jobs every 30 seconds
    const interval = setInterval(fetchJobs, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [user, userTrade]); // Adaugă userTrade în dependențe

  const handleJobClick = (jobId) => {
    router.push(`/dashboard/job-details/${jobId}`);
  };

  if (loading) {
    return <div>Loading available jobs...</div>;
  }

  const schema = jobs.map(job => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "Fix Acum",
      "value": job.id
    },
    "datePosted": new Date(job.created_at).toISOString(),
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Fix Acum",
      "sameAs": "https://www.fix-acum.ro"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location, // Asigură-te că ai câmpul 'location'
        "addressCountry": "RO"
      }
    }
  }));

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Lucrări pentru {userTrade}</h2>
        {jobs.length === 0 ? (
          <p>No available jobs found for your trade type.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li 
                key={job.id} 
                className="border-b pb-4 cursor-pointer hover:bg-gray-100 transition-colors p-4 rounded"
                onClick={() => handleJobClick(job.id)}
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
                <p className="text-sm text-gray-500">Price: ${job.budget}</p>
                <p className="text-sm text-gray-500">Status: {job.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
