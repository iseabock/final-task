'use client';

import { useState } from 'react';

import { Text, TextField } from '@radix-ui/themes';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button/Button';
import { useOrganization } from '@/hooks/queries/useOrganizations';
import { useCreateProject } from '@/hooks/queries/useProjects';

// Define the form data type
interface ProjectFormData {
  name: string;
  description: string;
  mode: 'scrum' | 'kanban' | 'none';
  organization_id: string;
}

const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  mode: 'none',
  organization_id: '',
};

const AddProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const { mutate: createProject, isPending, error } = useCreateProject();
  const resetForm = () => {
    setFormData(initialFormData);
  };
  const { data: organization } = useOrganization();

  console.log('organization :', organization);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createProject(
      {
        ...formData,
        organization_id: organization?._id?.toString() || '',
        createdBy: 'current-user-id', // TODO: Get this from auth context
      },
      {
        onSuccess: () => {
          resetForm();
          setIsOpen(false);
        },
        onError: (error) => {
          console.error('Failed to create project:', error);
        },
      }
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        <Button size="3" variant="solid">
          Add Project
        </Button>
      </Modal.Trigger>

      <Modal.Content
        title="Create New Project"
        description="Create a new project to organize your work"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}

          <div>
            <Text as="label" size="2" weight="bold">
              Project Name
            </Text>
            <TextField.Root
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <Text as="label" size="2" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Text as="label" size="2" weight="bold">
              Project Mode
            </Text>
            <select
              value={formData.mode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mode: e.target.value as ProjectFormData['mode'],
                }))
              }
            >
              <option value="none">None</option>
              <option value="scrum">Scrum</option>
              <option value="kanban">Kanban</option>
            </select>
          </div>

          <div>
            <Button
              type="button"
              variant="soft"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddProjectModal;
