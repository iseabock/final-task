import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
  organization_id: string;
}

interface CreateProjectData {
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
  organization_id: string;
}

export function useProjects(organizationId: string) {
  return useQuery<Project[]>({
    queryKey: ['projects', organizationId],
    queryFn: () => api.projects.list(organizationId),
    enabled: !!organizationId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectData) =>
      api.projects.create({
        ...data,
        organizationId: data.organization_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
