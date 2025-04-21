'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useOrganization } from '@/app/context/OrganizationContext';
import AddOrganizationModal from '@/components/AddOrganizationModal';

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    },
  });
  const router = useRouter();
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const {
    // organizations,
    currentOrganization,
    // setCurrentOrganization,
    isLoading,
    error,
  } = useOrganization();

  if (isLoading) return <div>Loading organizations...</div>;
  if (error) return <div>Error: {error}</div>;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  console.log('currentOrganization', currentOrganization);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {!currentOrganization && (
          <button
            onClick={() => setIsAddOrgModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Organization
          </button>
        )}
      </div>
      <AddOrganizationModal
        open={isAddOrgModalOpen}
        onOpenChange={setIsAddOrgModalOpen}
      />
    </div>
  );
}
