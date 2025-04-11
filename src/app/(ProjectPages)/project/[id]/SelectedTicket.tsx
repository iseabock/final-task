import { useEffect, useReducer } from 'react';

import { Box, Button, Grid, Text, TextField } from '@radix-ui/themes';

import { ITicket } from '@/db/models/Ticket';

import styles from './ticket.module.css';

const SelectedTicket = ({
  ticket,
  onTicketUpdated,
}: {
  ticket: ITicket;
  onTicketUpdated: (updatedTicket: ITicket) => void;
}) => {
  const initialState = {
    id: ticket._id,
    projectId: ticket.project_id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    points: ticket.points,
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
    try {
      const updatedTicket = {
        ...ticket,
        title: state.title,
        description: state.description,
        status: state.status,
        priority: state.priority,
        points: state.points,
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

  const handleDelete = async (id: unknown) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${state.projectId}/tickets`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(id),
        }
      );

      if (!response.ok) {
        const message = `Error: ${response.status}`;
        throw new Error(message);
      }

      // Handle successful deletion (e.g., update UI, remove item from list)
      console.log('Item deleted successfully');
      // Example: Update state to remove the deleted item
      // setData(data.filter(item => item.id !== id));
    } catch (error) {
      // Handle errors (e.g., display error message)
      console.error('There was an error deleting the item:', error);
    }
  };

  useEffect(() => {
    dispatch({ type: 'RESET_FORM' });
  }, [ticket]);

  return (
    <Box className={styles.selectedTicket}>
      <Button
        onClick={() =>
          dispatch({ type: 'EDITING_MODE', isEditing: !state.isEditing })
        }
      >
        Edit
      </Button>
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
            <Text size="4" mb="1" weight="bold">
              {state.title}
            </Text>
          )}
          {state.isEditing ? (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
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
              <TextField.Root
                placeholder="Assignee"
                value={state.assignee}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'assignee',
                    value: e.target.value,
                  })
                }
              />
            ) : (
              <Text>{state.assignee}</Text>
            )}
          </label>
          <Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              {state.isEditing ? (
                <select
                  value={state.status}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'status',
                      value: e.target.value,
                    })
                  }
                >
                  <option value="open">Open</option>
                  <option value="inProgress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <Text>{state.status}</Text>
              )}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Priority
              </Text>
              {state.isEditing ? (
                <select
                  value={state.priority}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'priority',
                      value: e.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
            {state.isEditing ? (
              <TextField.Root
                placeholder="Created By"
                value={state.createdBy}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'createdBy',
                    value: e.target.value,
                  })
                }
              />
            ) : (
              <Text>{state.createdBy}</Text>
            )}
          </label>
          {/* <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Created At
            </Text>
            <TextField.Root
              placeholder="Created At"
              value={state.createdAt}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'createdAt',
                  value: e.target.value,
                })
              }
            />
          </label> */}
          {state.isEditing && <Button type="submit">Save Edits</Button>}
          <Button onClick={() => handleDelete(ticket._id)}>Delete</Button>
        </form>
      </Box>
    </Box>
  );
};

export default SelectedTicket;
