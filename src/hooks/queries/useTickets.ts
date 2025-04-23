import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import mongoose from 'mongoose';

import { api } from '@/services/api';

interface Ticket {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  points?: number;
  createdBy: string;
  assignee: string;
  mode: 'scrum' | 'kanban' | 'none';
}

interface CreateTicketData {
  title: string;
  description: string;
  createdBy: string;
  status: string;
  priority: string;
  points: number;
  assignee: string;
  projectId: mongoose.Types.ObjectId;
}

export function useTickets(projectId: string | undefined) {
  return useQuery<Ticket[]>({
    queryKey: ['tickets', projectId],
    queryFn: () => {
      if (!projectId) throw new Error('Project ID is required');
      return api.projects.tickets.list(projectId);
    },
    enabled: !!projectId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketData) => {
      const ticketData = {
        ...data,
        status: data.status as 'open' | 'inProgress' | 'closed',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
      };
      return api.projects.tickets.create(data.projectId.toString(), ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
