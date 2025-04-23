'use client';

import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          onOpenChange(false);
          router.push('/dashboard');
        }
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
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

        if (result?.ok) {
          onOpenChange(false);
          router.refresh();
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          {mode === 'signup' && (
            <TextField.Root>
              <TextField.Slot>
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </TextField.Slot>
            </TextField.Root>
          )}
          <TextField.Root
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField.Root
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Loading...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Sign Up'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              disabled={isLoading}
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
