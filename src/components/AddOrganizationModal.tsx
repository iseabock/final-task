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
        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          <div>
            <label htmlFor="name">Organization Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
