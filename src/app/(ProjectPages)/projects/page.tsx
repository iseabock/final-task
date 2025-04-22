'use client';

import { Box, Flex } from '@radix-ui/themes';

import { useProjects } from '@/hooks/queries/useProjects';

import styles from './projects.module.css';

const ProjectsPage = () => {
  const { data: projects, isLoading, error } = useProjects('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Error: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Projects</h1>
      <Flex gap="3">
        <Box width="20%" className={styles.box}></Box>
        <Box width="60%" className={styles.box}>
          <ul>
            {projects?.map((project) => (
              <li key={project._id} className="p-4 mb-4 border rounded-lg">
                <h2 className="text-xl font-bold">{project.name}</h2>
                {project.description && (
                  <p className="text-gray-600 mt-2">{project.description}</p>
                )}
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                    Mode: {project.mode}
                  </span>
                </div>
              </li>
            ))}
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
