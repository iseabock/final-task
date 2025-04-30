'use client';

import { useState } from 'react';

import { Box, Flex } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/Button/Button';

import styles from './header.module.css';

import AuthModal from '../../app/AuthModal';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  // const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  return (
    <Box className={styles.header}>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <Flex justify="between" align="center" px="4" py="2">
        <h1>Final Task</h1>
        <Flex gap="3" align="center">
          {status === 'authenticated' ? (
            <>
              <span>Welcome, {session.user?.name}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button
              size="md"
              variant="solid"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
