'use client';

import { useState } from 'react';

import {
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Table,
  Text,
} from '@radix-ui/themes';
import { Session } from 'next-auth';

import AddOrganizationModal from '@/app/(DashboardPages)/dashboard/AddOrganizationModal';
import AddProjectModal from '@/components/AddProjectModal';
import { IOrganization } from '@/db/models/Organization';
import { IProject } from '@/db/models/Project';

import styles from './dashboard.module.css';

import ProjectCard from './ProjectCard';

export default function FirstColumn({
  session,
  organization,
  projects,
}: {
  session: Session;
  organization?: IOrganization;
  projects?: IProject[];
}) {
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);

  return (
    <Flex
      flexShrink="0"
      gap="6"
      direction="column"
      style={{ width: 'calc(40% - var(--space-6))' }}
    >
      <Card size="4">
        <div>
          {organization ? (
            <div>
              <h1>{organization.name} Dashboard</h1>
              {organization.description && <p>{organization.description}</p>}
              {organization.owner.toString() === session?.user?.id && (
                <>
                  <span>{session.user.name}</span>{' '}
                  <Badge color="gray">Owner</Badge>
                </>
              )}
            </div>
          ) : (
            <div>
              <p>
                You are not part of any organization. Create one to get started.
              </p>
              <AddOrganizationModal
                open={isAddOrgModalOpen}
                onOpenChange={setIsAddOrgModalOpen}
              />
            </div>
          )}
        </div>
      </Card>

      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          Current Projects
        </Heading>
        {projects?.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tickets</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell />
                <Table.ColumnHeaderCell />
                <Table.ColumnHeaderCell />
                <Table.ColumnHeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body className={styles.projectCard}>
              {projects &&
                projects?.length > 0 &&
                projects.map((project) => (
                  <Table.Row key={project._id.toString()}>
                    <ProjectCard project={project as IProject} />
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        )}
        <Box className={styles.addProjectModal}>
          <AddProjectModal session={session} />
        </Box>
      </Card>

      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="2">
          Charts
        </Heading>

        <Text as="p" size="2" mb="5" color="gray">
          Charts will go here
        </Text>

        <Grid columns="3" gap="6"></Grid>
      </Card>
    </Flex>
  );
}
