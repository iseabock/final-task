'use client';

import { Box, Flex } from '@radix-ui/themes';

import AddProjectModal from '@/components/AddProjectModal';
import { useOrganization } from '@/hooks/queries/useOrganizations';
import { useProjects } from '@/hooks/queries/useProjects';

import styles from './projects.module.css';

const ProjectsPage = () => {
  const { data: organization, isLoading: isLoadingOrg } = useOrganization();
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error,
  } = useProjects(organization?._id);

  if (isLoadingOrg || isLoadingProjects) {
    return (
      <div>
        <div>Loading projects...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div>
        <div>No organization found</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>Error: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <>
      <h1>Projects for {organization.name}</h1>
      <Flex gap="3">
        <Box width="20%" className={styles.box}>
          <AddProjectModal />
        </Box>
        <Box width="60%" className={styles.box}>
          <ul>
            {projects?.map((project) => (
              <li key={project._id}>
                <h2>{project.name}</h2>
                {project.description && <p>{project.description}</p>}
                <div>
                  <span>Mode: {project.mode}</span>
                </div>
              </li>
            ))}
            {projects?.length === 0 && <p>No projects found</p>}
          </ul>
        </Box>
        <Box width="20%" className={styles.box}>
          Column 3
        </Box>
      </Flex>
    </>
  );
};

export default ProjectsPage;
