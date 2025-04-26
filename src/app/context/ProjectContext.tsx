'use client';

import React, { createContext, useContext, useState } from 'react';

import mongoose from 'mongoose';

type User = {
  id: string;
  name: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
};

type ProjectContextType = {
  getUsersForProject: (
    project_id: mongoose.Schema.Types.ObjectId
  ) => Promise<User[]>;
  getProject: (
    project_id: mongoose.Schema.Types.ObjectId
  ) => Promise<Project | null>;
  usersByProject: Record<string, User[]>;
  projects: Record<string, Project>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usersByProject, setUsersByProject] = useState<Record<string, User[]>>(
    {}
  );
  const [projects, setProjects] = useState<Record<string, Project>>({});

  const getUsersForProject = async (
    projectId: mongoose.Schema.Types.ObjectId
  ): Promise<User[]> => {
    const key = projectId.toString();
    if (usersByProject[key]) return usersByProject[key];

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${key}/users`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.statusText}`);
      }
      const data: User[] = await res.json();
      setUsersByProject((prev) => ({ ...prev, [key]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const getProject = async (
    projectId: mongoose.Schema.Types.ObjectId
  ): Promise<Project | null> => {
    const key = projectId.toString();
    if (projects[key]) return projects[key];

    const res = await fetch(`/api/projects/${key}`);
    if (!res.ok) return null;

    const data: Project = await res.json();
    setProjects((prev) => ({ ...prev, [key]: data }));
    return data;
  };

  return (
    <ProjectContext.Provider
      value={{ getUsersForProject, getProject, usersByProject, projects }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
