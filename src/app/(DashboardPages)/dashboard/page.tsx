'use client';

import { Box, Flex, Spinner } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { IOrganization } from '@/db/models/Organization';
import { IProject } from '@/db/models/Project';
import { useOrganization } from '@/hooks/queries/useOrganizations';
import { useProjects } from '@/hooks/queries/useProjects';

import styles from './dashboard.module.css';

import FirstColumn from './FirstColumn';
import SecondColumn from './SecondColumn';
import ThirdColumn from './ThirdColumn';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    },
  });
  const router = useRouter();

  const {
    data: organization,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganization();

  const {
    data: projects,
    // isLoading: isLoadingProjects,
    // error: projectsError,
  } = useProjects(organization?._id ?? '');

  if (status === 'loading' || isLoadingOrg) {
    return (
      <Box className={styles.spinnerContainer}>
        <Spinner size="3" />
      </Box>
    );
  }

  if (orgError) {
    return (
      <div>
        <div>Error: {(orgError as Error).message}</div>
      </div>
    );
  }

  return (
    <Box style={{ padding: '10px' }}>
      <Flex align="start" gap="6">
        <FirstColumn
          session={session}
          organization={organization as unknown as IOrganization}
          projects={projects as unknown as IProject[]}
        />

        <SecondColumn />

        <ThirdColumn />
      </Flex>
    </Box>
  );
}
