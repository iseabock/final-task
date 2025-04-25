'use client';

import { useEffect, useReducer, useState } from 'react';

import { Text, TextArea, TextField } from '@radix-ui/themes';
import mongoose from 'mongoose';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button/Button';
import { IUser } from '@/db/models/User';

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
            createdBy: state.createdBy,
            createdAt: state.createdAt,
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
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Status
            </Text>
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
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Priority
            </Text>
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
              <option value="critical">Critical</option>
            </select>
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Type
            </Text>
            <select
              value={state.type}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'type',
                  value: e.target.value,
                })
              }
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
            </select>
          </label>
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
            <select
              name="assignee"
              value={state.assignee}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'assignee',
                  value: e.target.value,
                })
              }
            >
              {users?.map((user) => {
                return (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Created By
            </Text>
            <select
              name="createdBy"
              value={state.createdBy}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'createdBy',
                  value: e.target.value,
                })
              }
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <label>
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
          </label>
          <Button type="submit">Add Ticket</Button>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddTicketModal;
