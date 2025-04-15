'use client';

import React, { createContext, useContext, useState } from 'react';

import mongoose from 'mongoose';

type User = {
  id: string;
  name: string;
  email: string;
};

type ProjectUsersContextType = {
  getUsersForProject: (
    project_id: mongoose.Schema.Types.ObjectId
  ) => Promise<User[]>;
  usersByProject: Record<string, User[]>;
};

const ProjectUsersContext = createContext<ProjectUsersContextType | undefined>(
  undefined
);

export const ProjectUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usersByProject, setUsersByProject] = useState<Record<string, User[]>>(
    {}
  );

  const getUsersForProject = async (
    projectId: mongoose.Schema.Types.ObjectId
  ): Promise<User[]> => {
    if (usersByProject[projectId?.toString()]) {
      return usersByProject[projectId.toString()];
    }

    const res = await fetch(`/api/projects/${projectId}/users`);
    const data: User[] = await res.json();

    setUsersByProject((prev) => ({
      ...prev,
      [projectId.toString()]: data,
    }));

    return data;
  };

  return (
    <ProjectUsersContext.Provider
      value={{ getUsersForProject, usersByProject }}
    >
      {children}
    </ProjectUsersContext.Provider>
  );
};

export const useProjectUsers = () => {
  const context = useContext(ProjectUsersContext);
  if (!context)
    throw new Error(
      'useProjectUsers must be used within a ProjectUsersProvider'
    );
  return context;
};
