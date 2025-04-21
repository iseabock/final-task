'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import AddOrganizationModal from '@/components/AddOrganizationModal';
import { useOrganizations } from '@/hooks/queries/useOrganizations';

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
    data: organizations,
    isLoading: isLoadingOrgs,
    error: orgsError,
  } = useOrganizations();

  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);

  if (status === 'loading' || isLoadingOrgs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (orgsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Error loading organizations: {(orgsError as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {organizations && organizations.length > 1 ? (
          <select
            value={currentOrgId || ''}
            onChange={(e) => setCurrentOrgId(e.target.value || null)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        ) : (
          <div>{organizations?.[0].name}</div>
        )}
        {!organizations?.length && (
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
