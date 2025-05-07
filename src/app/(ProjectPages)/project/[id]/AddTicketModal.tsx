'use client';

import { useEffect, useReducer, useState } from 'react';

import {
  Box,
  Flex,
  Select as RadixSelect,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import mongoose from 'mongoose';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';
import { IUser } from '@/db/models/User';

import styles from './addTicketModal.module.css';

import { useProject } from '../../../context/ProjectContext';

const initialState = {
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  points: '0',
  type: 'feature',
  assignee: '',
  createdBy: '',
  createdAt: '',
  isOpen: false,
};

type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'TOGGLE_MODAL'; isOpen: boolean }
  | { type: 'RESET_FORM' };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_MODAL':
      return { ...state, isOpen: action.isOpen };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const AddTicketModal = ({
  projectId,
  onTicketAdded,
}: {
  projectId: string;
  onTicketAdded: () => void;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getUsersForProject } = useProject();
  const [users, setUsers] = useState<IUser[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/tickets`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            title: state.title,
            description: state.description,
            status: state.status,
            priority: state.priority,
            points: state.points,
            type: state.type,
            assignee: state.assignee,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to add project');

      dispatch({ type: 'RESET_FORM' });

      onTicketAdded();

      dispatch({ type: 'TOGGLE_MODAL', isOpen: false });
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsersForProject(
        projectId as unknown as mongoose.Schema.Types.ObjectId
      );
      setUsers(data as IUser[]);
    };

    loadUsers();
  }, [projectId, getUsersForProject]);

  return (
    <Modal
      open={state.isOpen}
      onOpenChange={(isOpen) => dispatch({ type: 'TOGGLE_MODAL', isOpen })}
    >
      <Modal.Trigger asChild>
        <Button size="sm">Add Ticket</Button>
      </Modal.Trigger>
      <Modal.Content title="Add Ticket" description="">
        <form onSubmit={handleSubmit}>
          <Box className={styles.inputSection}>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                placeholder="Add a title that describes the ticket"
                value={state.title}
                radius="large"
                size="3"
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'title',
                    value: e.target.value,
                  })
                }
              />
            </label>
          </Box>
          <Box className={styles.inputSection}>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                placeholder="Add a description that give more context to the ticket"
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'description',
                    value: e.target.value,
                  })
                }
              />
            </label>
          </Box>
          <Box className={styles.inputSection}>
            <Flex gap="4" justify="between" align="center">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Status
                </Text>
                <Select
                  value={state.status}
                  size="sm"
                  color="gray"
                  className={styles.statusSelect}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'status',
                      value,
                    })
                  }
                >
                  <RadixSelect.Item value="backlog">Backlog</RadixSelect.Item>
                  <RadixSelect.Item value="open">Open</RadixSelect.Item>
                  <RadixSelect.Item value="inProgress">
                    In Progress
                  </RadixSelect.Item>
                  <RadixSelect.Item value="closed">Closed</RadixSelect.Item>
                </Select>
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Priority
                </Text>
                <Select
                  value={state.priority}
                  size="sm"
                  color="gray"
                  className={styles.prioritySelect}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'priority',
                      value,
                    })
                  }
                >
                  <RadixSelect.Item value="low">Low</RadixSelect.Item>
                  <RadixSelect.Item value="medium">Medium</RadixSelect.Item>
                  <RadixSelect.Item value="high">High</RadixSelect.Item>
                  <RadixSelect.Item value="critical">Critical</RadixSelect.Item>
                </Select>
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Type
                </Text>
                <Select
                  value={state.type}
                  size="sm"
                  color="gray"
                  className={styles.typeSelect}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'type',
                      value,
                    })
                  }
                >
                  <RadixSelect.Item value="feature">Feature</RadixSelect.Item>
                  <RadixSelect.Item value="bug">Bug</RadixSelect.Item>
                  <RadixSelect.Item value="task">Task</RadixSelect.Item>
                </Select>
              </label>
            </Flex>
          </Box>
          <Box className={styles.inputSection}>
            <Flex gap="4" justify="between" align="center">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Points
                </Text>
                <TextField.Root
                  placeholder="Points"
                  value={state.points}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'points',
                      value: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Assignee
                </Text>
                <Select
                  value={state.assignee}
                  size="sm"
                  color="gray"
                  className={styles.assigneeSelect}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'assignee',
                      value,
                    })
                  }
                >
                  {users?.map((user) => (
                    <RadixSelect.Item
                      key={user._id.toString()}
                      value={user._id.toString()}
                    >
                      {user.name}
                    </RadixSelect.Item>
                  ))}
                </Select>
              </label>
            </Flex>
          </Box>
          <Box className={styles.inputSection}>
            <Button type="submit">Add Ticket</Button>
          </Box>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddTicketModal;
