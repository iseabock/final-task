import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  organizationId: string;
  mode: 'scrum' | 'kanban' | 'none';
}

interface CreateProjectData {
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
  organization_id: string;
}

// *
// * Fetch Projects
// *
export function useProjects(organizationId: string | undefined) {
  return useQuery<Project[]>({
    queryKey: ['projects', organizationId],
    queryFn: () => {
      if (!organizationId) throw new Error('Organization ID is required');
      return api.projects.list(organizationId);
    },
    enabled: !!organizationId,
  });
}

// *
// * Create Project
// *
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
