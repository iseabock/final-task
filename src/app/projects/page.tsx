'use client';

import { useEffect, useState } from 'react';

import { Box, Flex } from '@radix-ui/themes';

import styles from './projects.module.css';

import { IProject } from '../../db/models/Project';
import AddProjectModal from './AddProjectModal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);

  // Fetch projects when the component mounts
  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data: IProject[] = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <h1>Projects</h1>
      <Flex gap="3">
        <Box width="20%" className={styles.box}>
          {/* Pass fetchProjects to refresh projects after adding a new one */}
          <AddProjectModal fetchProjects={fetchProjects} />
        </Box>
        <Box width="60%" className={styles.box}>
          <ul>
            {projects.map((project) => (
              <li key={project._id}>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <small>Mode: {project.mode}</small>
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
