'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import AddOrganizationModal from '@/components/AddOrganizationModal';
import AddProjectModal from '@/components/AddProjectModal';
import { useOrganization } from '@/hooks/queries/useOrganizations';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    },
  });
  const router = useRouter();
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);

  const {
    data: organization,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganization();

  if (status === 'loading' || isLoadingOrg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Error: {(orgError as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {!organization && (
          <button
            onClick={() => setIsAddOrgModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Organization
          </button>
        )}
      </div>

      {organization ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold">{organization.name}</h2>
          {organization.description && (
            <p className="text-gray-600 mt-2">{organization.description}</p>
          )}
          {organization.owner === session?.user?.id && (
            <span className="inline-block mt-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              Owner
            </span>
          )}
          <AddProjectModal />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            You are not part of any organization. Create one to get started.
          </p>
        </div>
      )}

      <AddOrganizationModal
        open={isAddOrgModalOpen}
        onOpenChange={setIsAddOrgModalOpen}
      />
    </div>
  );
}
