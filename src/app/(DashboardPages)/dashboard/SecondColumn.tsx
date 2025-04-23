import { Box, Card, Flex, Heading } from '@radix-ui/themes';

import AddProjectModal from '@/components/AddProjectModal';
import { IProject } from '@/db/models/Project';

import ProjectCard from './ProjectCard';

const SecondColumn = ({ projects }: { projects: IProject[] }) => {
  return (
    <Flex as="div" flexShrink="0" gap="6" direction="column" width="30%">
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          Current Projects
        </Heading>

        <Box>
          {projects?.length === 0 && (
            <p className="text-gray-500">No projects found</p>
          )}
          {projects &&
            projects?.length > 0 &&
            projects.map((project) => (
              <ProjectCard key={project._id} project={project as IProject} />
            ))}
        </Box>
        <Box>
          <AddProjectModal />
        </Box>
      </Card>
    </Flex>
  );
};

export default SecondColumn;
