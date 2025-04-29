import { useEffect, useReducer, useState } from 'react';

import { Cross1Icon } from '@radix-ui/react-icons';
import {
  Box,
  Flex,
  Grid,
  Select as RadixSelect,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import mongoose from 'mongoose';

import ConfirmationDialog from '@/components/ConfirmationDialog';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';
import { ITicket } from '@/db/models/Ticket';
import { IUser } from '@/db/models/User';
import { useDeleteTicket } from '@/hooks/useDeleteTicket';

import styles from './ticket.module.css';

import { useProject } from '../../../context/ProjectContext';

const SelectedTicket = ({
  ticket,
  onTicketUpdated,
  onTicketDeleted,
}: {
  ticket: ITicket;
  onTicketUpdated: (updatedTicket: ITicket) => void;
  onTicketDeleted: (deletedTicketId: string) => void;
}) => {
  const { getUsersForProject } = useProject();
  const [users, setUsers] = useState<IUser[]>([]);

  const initialState = {
    id: ticket._id,
    projectId: ticket.project_id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    points: ticket.points,
    type: ticket.type,
    assignee: ticket.assignee,
    createdBy: ticket.created_by,
    createdAt: ticket.created_at,
    isEditing: false,
  };

  type Action =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'EDITING_MODE'; isEditing: boolean }
    | { type: 'RESET_FORM' };

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case 'SET_FIELD':
        return { ...state, [action.field]: action.value };
      case 'EDITING_MODE':
        return { ...state, isEditing: action.isEditing };
      case 'RESET_FORM':
        return initialState;
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    // * Keep handleEdit from being called durring DELETE
    if (!state.isEditing) return;

    try {
      const updatedTicket = {
        ...ticket,
        title: state.title,
        description: state.description,
        status: state.status,
        priority: state.priority,
        points: state.points,
        type: state.type,
        assignee: state.assignee,
        created_by: state.createdBy,
        created_at: state.createdAt,
        project_id: state.projectId,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${state.projectId}/tickets`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTicket),
        }
      );

      if (!res.ok) throw new Error('Failed to update ticket');

      dispatch({ type: 'EDITING_MODE', isEditing: !state.isEditing });

      onTicketUpdated(updatedTicket as ITicket);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const deleteTicket = useDeleteTicket(onTicketDeleted);

  useEffect(() => {
    dispatch({ type: 'RESET_FORM' });
  }, [ticket]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsersForProject(
        state.projectId as mongoose.Schema.Types.ObjectId
      );
      setUsers(data as IUser[]);
    };
    loadUsers();
  }, [state.projectId, getUsersForProject]);

  return (
    <Box className={styles.selectedTicket}>
      <Box>
        <form onSubmit={handleEdit}>
          {state.isEditing ? (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                placeholder="Title"
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'title',
                    value: e.target.value,
                  })
                }
              />
            </label>
          ) : (
            <Text as="div" size="4" mb="1" weight="bold">
              {state.title}
            </Text>
          )}
          {state.isEditing ? (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                placeholder="Description"
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
          ) : (
            <Text>{state.description}</Text>
          )}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Assignee
            </Text>
            {state.isEditing ? (
              <Select
                value={state.assignee?.toString()}
                size="sm"
                color="gray"
                onValueChange={(value) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'assignee',
                    value,
                  })
                }
              >
                {users.map((user) => (
                  <RadixSelect.Item
                    key={user._id.toString()}
                    value={user._id.toString()}
                  >
                    {user.name}
                  </RadixSelect.Item>
                ))}
              </Select>
            ) : (
              <Text>
                {
                  users.find(
                    (user) =>
                      user._id.toString() === ticket.assignee?.toString()
                  )?.name
                }
              </Text>
            )}
          </label>
          <Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              {state.isEditing ? (
                <Select
                  value={state.status}
                  size="sm"
                  color="gray"
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'status',
                      value,
                    })
                  }
                >
                  <RadixSelect.Item value="open">Open</RadixSelect.Item>
                  <RadixSelect.Item value="inProgress">
                    In Progress
                  </RadixSelect.Item>
                  <RadixSelect.Item value="closed">Closed</RadixSelect.Item>
                </Select>
              ) : (
                <Text>{state.status}</Text>
              )}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Priority
              </Text>
              {state.isEditing ? (
                <Select
                  value={state.priority}
                  size="sm"
                  color="gray"
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
              ) : (
                <Text>{state.priority}</Text>
              )}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Points
              </Text>
              {state.isEditing ? (
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
              ) : (
                <Text>{state.points}</Text>
              )}
            </label>
          </Grid>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Created By
            </Text>

            <Text>
              {
                users.find(
                  (user) =>
                    user._id.toString() === ticket.created_by?.toString()
                )?.name
              }
            </Text>
          </label>
          <Flex gap="4" justify="between" align="center" width="30%">
            {state.isEditing && (
              <Button size="sm" type="submit">
                Save Edits
              </Button>
            )}

            <Button
              size="sm"
              type="button"
              onClick={() =>
                dispatch({ type: 'EDITING_MODE', isEditing: !state.isEditing })
              }
            >
              {state.isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </Flex>
        </form>
        <ConfirmationDialog
          title="Are you sure you want to delete?"
          message="This action can not be undone"
          triggerText={<Cross1Icon />}
          confirmText="Delete"
          className={styles.deleteButton}
          onConfirm={() =>
            deleteTicket(ticket._id.toString(), ticket.project_id.toString())
          }
          type="delete"
        />
      </Box>
    </Box>
  );
};

export default SelectedTicket;
