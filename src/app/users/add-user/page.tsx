'use client';

import { useState } from 'react';

import { Button, TextField } from '@radix-ui/themes';

const UserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');

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
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h1>Add New User</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <TextField.Root
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField.Root
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="qa">QA</option>
        </select>
        <Button type="submit">Add User</Button>
      </form>
    </div>
  );
};

export default UserPage;
