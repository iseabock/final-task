import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
}

interface CreateProjectData {
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: api.projects.list,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
