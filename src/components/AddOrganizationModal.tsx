'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useCreateOrganization } from '@/hooks/queries/useOrganizations';

import Modal from './Modal';

export default function AddOrganizationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const { mutate: createOrganization, isPending } = useCreateOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    createOrganization(
      { name, description },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
        },
        onError: (error) => {
          setError(
            error instanceof Error ? error.message : 'An error occurred'
          );
        },
      }
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        title="Create Organization"
        description="Create a new organization to manage your projects and tickets"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Organization Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
