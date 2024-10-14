// pages/dashboard/worker.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Overview from '@/components/worker/Overview';
import JobsList from '@/components/worker/JobList';
import Profile from '@/components/worker/Profile';

import Reviews from '@/components/worker/Reviews';
import Settings from '@/components/worker/Settings';

export default function WorkerDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);



  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview workerData={user} />;
      case 'Jobs':
        return <JobsList workerId={user.id} />;
      case 'Profile':
        return <Profile workerData={user} />;
      case 'Reviews':
        return <Reviews workerId={user.id} />;
      case 'Settings':
        return <Settings user={user} />;
      default:
        return <Overview workerData={user} />;
    }
  };

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
