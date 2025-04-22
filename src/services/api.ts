const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  // * Organizations endpoints
  organizations: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/api/organizations`);
      if (!res.ok) throw new Error('Failed to fetch organization');
      return res.json();
    },
    create: async (data: { name: string; description?: string }) => {
      const res = await fetch(`${BASE_URL}/api/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create organization');
      }
      return res.json();
    },
  },
  // * Projects endpoints
  projects: {
    list: async (organizationId: string) => {
      const res = await fetch(
        `${BASE_URL}/api/projects?organizationId=${organizationId}`,
        {
          cache: 'no-store',
        }
      );
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return res.json();
    },
    create: async (data: {
      name: string;
      description?: string;
      createdBy: string;
      mode: 'scrum' | 'kanban' | 'none';
      organizationId: string;
    }) => {
      const res = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    update: async (
      id: string,
      data: {
        name?: string;
        description?: string;
        mode?: 'scrum' | 'kanban' | 'none';
      }
    ) => {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return res.json();
    },
    // * Project users endpoints
    users: {
      list: async (projectId: string) => {
        const res = await fetch(`${BASE_URL}/api/projects/${projectId}/users`);
        if (!res.ok) throw new Error('Failed to fetch project users');
        return res.json();
      },
      add: async (projectId: string, userId: string) => {
        const res = await fetch(`${BASE_URL}/api/projects/${projectId}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error('Failed to add user to project');
        return res.json();
      },
      remove: async (projectId: string, userId: string) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/users/${userId}`,
          {
            method: 'DELETE',
          }
        );
        if (!res.ok) throw new Error('Failed to remove user from project');
        return res.json();
      },
    },
    // * Project tickets endpoints
    tickets: {
      list: async (projectId: string) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/tickets`
        );
        if (!res.ok) throw new Error('Failed to fetch project tickets');
        return res.json();
      },

      getById: async (projectId: string, ticketId: string) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/tickets/${ticketId}`
        );
        if (!res.ok) throw new Error('Failed to fetch ticket');
        return res.json();
      },

      create: async (
        projectId: string,
        data: {
          title: string;
          description?: string;
          status: 'open' | 'inProgress' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'critical';
          points?: number;
          assignee?: string;
        }
      ) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/tickets`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) throw new Error('Failed to create ticket');
        return res.json();
      },

      update: async (
        projectId: string,
        ticketId: string,
        data: {
          title?: string;
          description?: string;
          status?: 'open' | 'inProgress' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          points?: number;
          assignee?: string;
        }
      ) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/tickets/${ticketId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) throw new Error('Failed to update ticket');
        return res.json();
      },

      delete: async (projectId: string, ticketId: string) => {
        const res = await fetch(
          `${BASE_URL}/api/projects/${projectId}/tickets/${ticketId}`,
          {
            method: 'DELETE',
          }
        );
        if (!res.ok) throw new Error('Failed to delete ticket');
        return res.json();
      },
    },
  },
};
