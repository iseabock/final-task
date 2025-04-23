'use client';

import { useState } from 'react';

import { Text, TextField } from '@radix-ui/themes';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button/Button';

const AddUserModal = ({ fetchUsers }: { fetchUsers: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) throw new Error('Failed to add user');

      setName('');
      setEmail('');
      setRole('developer');
      fetchUsers();
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        <Button>Add User</Button>
      </Modal.Trigger>
      <Modal.Content title="Add User" description="">
        <form onSubmit={handleSubmit}>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Role
            </Text>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="qa">QA</option>
            </select>
          </label>
          <Button type="submit">Add User</Button>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddUserModal;
