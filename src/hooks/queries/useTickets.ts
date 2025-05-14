import { useCallback } from 'react';

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
  type?: string;
  createdBy: string;
  assignee?: string;
  mode: 'scrum' | 'kanban' | 'none';
}

interface CreateTicketData {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  status: string;
  priority: string;
  points: number;
  type: string;
  assignee: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
}

// *
// * Fetch Tickets
// *
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

// *
// * Create Ticket
// *
export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketData) => {
      const ticketData = {
        ...data,
        status: data.status as 'backlog' | 'open' | 'inProgress' | 'closed',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        type: data.type as 'bug' | 'feature',
      };
      return api.projects.tickets.create(data.projectId.toString(), {
        ...ticketData,
        assignee: ticketData.assignee.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

// *
// * Delete Ticket
// *
export const useDeleteTicket = (onTicketDeleted: (id: string) => void) => {
  return useCallback(
    async (ticketId: string, projectId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/tickets`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketId),
          }
        );

        if (!response.ok) {
          const message = `Error: ${response.status}`;
          throw new Error(message);
        }

        onTicketDeleted(ticketId);
      } catch (error) {
        console.error('There was an error deleting the item:', error);
      }
    },
    [onTicketDeleted]
  );
};
