import { Box, Card, Flex, Heading, Table } from '@radix-ui/themes';

import AddProjectModal from '@/components/AddProjectModal';
import { IProject } from '@/db/models/Project';

import styles from './dashboard.module.css';

import ProjectCard from './ProjectCard';

const SecondColumn = ({ projects }: { projects: IProject[] }) => {
  return (
    <Flex
      as="div"
      flexShrink="0"
      gap="6"
      direction="column"
      width="30%"
      className={styles.currentProjects}
    >
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          Current Projects
        </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tickets</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className={styles.projectCard}>
            {projects?.length === 0 && <p>No projects found</p>}
            {projects &&
              projects?.length > 0 &&
              projects.map((project) => (
                <Table.Row key={project._id}>
                  <ProjectCard project={project as IProject} />
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
        <Box className={styles.addProjectModal}>
          <AddProjectModal />
        </Box>
      </Card>
    </Flex>
  );
};

export default SecondColumn;
