'use client';

import { useState } from 'react';

import { Text, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button/Button';
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
      <Modal.Trigger asChild>
        <Button size="md" variant="solid">
          Add Organization
        </Button>
      </Modal.Trigger>
      <Modal.Content
        title="Create Organization"
        description="Create a new organization to manage your projects and tickets"
      >
        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          <div>
            <Text as="label" size="2" weight="bold">
              Organization Name
            </Text>
            <TextField.Root
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Text as="label" size="2" weight="bold">
              Description
            </Text>
            <TextField.Root
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
