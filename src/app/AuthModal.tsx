'use client';

import { ChangeEvent, useState } from 'react';

import { Button, TextField } from '@radix-ui/themes';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Modal from '@/components/Modal';

type AuthMode = 'login' | 'signup';

export default function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        // * Handle login
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        setEmail('');
        setPassword('');
        setName('');
        onOpenChange(false);

        router.refresh();
      } else {
        // * Handle signup
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        setEmail('');
        setPassword('');
        setName('');
        onOpenChange(false);

        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
        description={
          mode === 'login'
            ? 'Sign in to your account to continue'
            : 'Create a new account to get started'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {mode === 'signup' && (
            <TextField.Root
              placeholder="Full Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
            />
          )}
          <TextField.Root
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <TextField.Root
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" variant="solid">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
