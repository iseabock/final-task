'use client';

import { useState } from 'react';

import { Box, Button, Flex } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import styles from './header.module.css';

import AuthModal from '../../app/AuthModal';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <Box className={styles.header}>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <Flex justify="between" align="center" px="4" py="2">
        <div>Task Manager</div>
        <Flex gap="3" align="center">
          {status === 'authenticated' ? (
            <>
              <span>Welcome, {session.user?.name}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button
              size="3"
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
