'use client';

import { useReducer } from 'react';

import { Button, Text, TextField } from '@radix-ui/themes';

import Modal from '@/components/Modal';

const initialState = {
  name: '',
  description: '',
  createdBy: '',
  mode: 'none',
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

const AddProjectModal = ({ fetchProjects }: { fetchProjects: () => void }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.name,
            description: state.description,
            createdBy: state.createdBy,
            mode: state.mode,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to add project');

      fetchProjects();
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <Modal
      open={state.isOpen}
      onOpenChange={(isOpen) => dispatch({ type: 'TOGGLE_MODAL', isOpen })}
    >
      <Modal.Trigger asChild>
        <Button>Add Project</Button>
      </Modal.Trigger>
      <Modal.Content title="Add User" description="">
        <form onSubmit={handleSubmit}>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Name"
              value={state.name}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'name',
                  value: e.target.value,
                })
              }
            />
          </label>
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
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Created By
            </Text>
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
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Mode
            </Text>
            <select
              value={state.mode}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'mode',
                  value: e.target.value,
                })
              }
            >
              <option value="scrum">Scrum</option>
              <option value="kanban">Kanban</option>
              <option value="none">None</option>
            </select>
          </label>
          <Button type="submit">Add Project</Button>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddProjectModal;
