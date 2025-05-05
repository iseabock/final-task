'use client';

import { useEffect, useState } from 'react';

import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text } from '@radix-ui/themes';

import camelCaseToTitleCase from '@/app/utils/camelCaseToTitleCase';
import Modal from '@/components/Modal';

interface Status {
  name: string;
}

const ProjectConfigModal = ({
  projectId,
  isOpen,
  onOpenChange,
  onConfigUpdated,
}: {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigUpdated?: () => void;
}) => {
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/config`
        );
        if (!res.ok) throw new Error('Failed to fetch config');
        const data = await res.json();
        setStatuses(data.statuses);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    if (isOpen) {
      fetchConfig();
    }
  }, [projectId, isOpen]);

  const handleAddStatus = () => {
    setStatuses([
      ...statuses,
      {
        name: 'New Status',
      },
    ]);
  };

  const handleRemoveStatus = (index: number) => {
    setStatuses(statuses.filter((_, i) => i !== index));
  };

  const handleUpdateStatus = (
    index: number,
    field: keyof Status,
    value: string
  ) => {
    const newStatuses = [...statuses];
    newStatuses[index] = {
      ...newStatuses[index],
      [field]: value,
    };
    setStatuses(newStatuses);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/config`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statuses }),
        }
      );
      if (!res.ok) throw new Error('Failed to update config');
      onOpenChange(false);
      onConfigUpdated?.();
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <Modal.Content
        title="Project Configuration"
        description="Manage your project settings"
      >
        <Box>
          <Text as="div" size="2" mb="2" weight="bold">
            Statuses
          </Text>
          {statuses.map((status, index) => (
            <Flex key={index} gap="2" mb="2" align="center">
              <input
                type="text"
                value={camelCaseToTitleCase(status.name)}
                onChange={(e) =>
                  handleUpdateStatus(index, 'name', e.target.value)
                }
                style={{ width: '150px' }}
              />
              <Button
                variant="ghost"
                color="red"
                onClick={() => handleRemoveStatus(index)}
              >
                <TrashIcon />
              </Button>
            </Flex>
          ))}
          <Button variant="outline" onClick={handleAddStatus}>
            <PlusIcon /> Add Status
          </Button>
        </Box>
        <Flex gap="3" mt="4" justify="end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </Flex>
      </Modal.Content>
    </Modal>
  );
};

export default ProjectConfigModal;
