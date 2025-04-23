'use client';

import { Box, Flex } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { IOrganization } from '@/db/models/Organization';
import { IProject } from '@/db/models/Project';
import { useOrganization } from '@/hooks/queries/useOrganizations';
import { useProjects } from '@/hooks/queries/useProjects';

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
      <div>
        <div>Loading...</div>
      </div>
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
        />

        <SecondColumn projects={projects as IProject[]} />

        <ThirdColumn />
      </Flex>
    </Box>
  );
}
