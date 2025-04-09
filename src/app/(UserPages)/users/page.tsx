'use client';

import { useCallback, useEffect, useState } from 'react';

import { IUser } from '@/db/models/User';

import AddUserModal from './AddUserModal';

const UserPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  // Memoize fetchUsers to avoid unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data: IUser[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // Fetch users only on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1>Users</h1>
      <AddUserModal fetchUsers={fetchUsers} />
      <ul>
        {users.map((user) => (
          <li key={user._id.toString()}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <small>Role: {user.role}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
