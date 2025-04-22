import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

interface Organization {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
}

export function useOrganization() {
  return useQuery<Organization | null>({
    queryKey: ['organization'],
    queryFn: api.organizations.list,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.organizations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });
}
