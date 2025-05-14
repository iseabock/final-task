'use client';

import { useEffect, useState } from 'react';

import { GearIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Heading, Link, Spinner } from '@radix-ui/themes';
import mongoose from 'mongoose';
import { useParams } from 'next/navigation';

import camelCaseToTitleCase from '@/app/utils/camelCaseToTitleCase';
import { IProject } from '@/db/models/Project';
import { IProjectConfig } from '@/db/models/ProjectConfig';
import { ITicket } from '@/db/models/Ticket';
import { IUser } from '@/db/models/User';
import { useOrganization } from '@/hooks/queries/useOrganizations';

import styles from './project.module.css';

import { useProject } from '../../../context/ProjectContext';
import AddTicketModal from './AddTicketModal';
import ProjectConfigModal from './ProjectConfigModal';
import SelectedTicket from './SelectedTicket';
import Ticket from './Ticket';

const ProjectPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [project, setProject] = useState<IProject>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [draggingOverColumn, setDraggingOverColumn] = useState<string | null>(
    null
  );
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(
    null
  );
  const { getProject, getUsersForProject } = useProject();
  const {
    data: organization,
    // isLoading: isLoadingOrg,
    // error: orgError,
  } = useOrganization();

  const [selectedTicket, setSelectedTicket] = useState<ITicket | undefined>();
  const params = useParams();
  const { id } = params;

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [projectConfig, setProjectConfig] = useState<IProjectConfig | null>(
    null
  );

  const fetchTickets = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/tickets`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data: ITicket[] = await res.json();
      if (data.length === 0) {
        console.warn('No tickets found for project');
      }
      setTickets(data);
      if (selectedTicket === undefined && data.length > 0) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId, status: newStatus }),
        }
      );

      if (!res.ok) throw new Error('Failed to update ticket status');
      const updatedTicket = await res.json();

      setTickets((prev) =>
        prev.map((t) => (t._id.toString() === ticketId ? updatedTicket : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTicketAdded = () => {
    fetchTickets();
  };

  const handleSelectedTicket = (ticket: ITicket) => {
    setSelectedTicket(ticket);
  };

  const handleTicketDeleted = (deletedTicketId: string) => {
    setTickets((prev) =>
      prev.filter((t) => t._id.toString() !== deletedTicketId)
    );
    if (selectedTicket?._id?.toString() === deletedTicketId) {
      setSelectedTicket(undefined);
    }
  };

  const getTicketsByStatus = (statusName: string) => {
    const filteredTickets = tickets.filter((t) => t.status === statusName);
    return filteredTickets;
  };

  useEffect(() => {
    const loadProject = async () => {
      const data = await getProject(
        id as unknown as mongoose.Schema.Types.ObjectId
      );
      setProject(data as IProject);
    };
    loadProject();
  }, [id, getProject]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsersForProject(
        id as unknown as mongoose.Schema.Types.ObjectId
      );
      setUsers(users as IUser[]);
    };
    loadUsers();
  }, [id, getUsersForProject]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/config`
        );
        if (!res.ok) throw new Error('Failed to fetch config');
        const data = await res.json();
        if (!data.statuses || data.statuses.length === 0) {
          console.warn('No statuses found in project config');
        }
        setProjectConfig(data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, [id]);

  const refreshProjectData = async () => {
    try {
      // Refresh config
      const configRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/config`
      );
      if (!configRes.ok) throw new Error('Failed to fetch config');
      const configData = await configRes.json();
      setProjectConfig(configData);

      // Refresh tickets
      const ticketsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/tickets`,
        { cache: 'no-store' }
      );
      if (!ticketsRes.ok) throw new Error('Failed to fetch tickets');
      const ticketsData = await ticketsRes.json();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error refreshing project data:', error);
    }
  };

  if (!projectConfig) {
    return (
      <Box className={styles.spinnerContainer}>
        <Spinner size="3" />
      </Box>
    );
  }

  return (
    <Box className={styles.projectContainer}>
      <Flex justify="between">
        <Box>
          <h1>
            <Link href="/dashboard">{organization?.name}</Link>
          </h1>
          <h2>{project?.name}</h2>
        </Box>
        <Button variant="outline" onClick={() => setIsConfigOpen(true)}>
          <GearIcon /> Configure
        </Button>
      </Flex>
      <Flex gap="3">
        <Flex className={styles.ticketsContainer} gap="3" align="start">
          {projectConfig.statuses.map((status) => {
            const statusTickets = getTicketsByStatus(status.name);
            return (
              <Box
                key={status.name}
                className={`${styles.column} ${
                  draggingOverColumn === status.name &&
                  draggedFromColumn !== status.name
                    ? styles.dragOver
                    : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggingOverColumn(status.name);
                }}
                onDragLeave={() => setDraggingOverColumn(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const ticketId = e.dataTransfer.getData('ticketId');
                  updateTicketStatus(ticketId, status.name);
                  setDraggingOverColumn(null);
                }}
              >
                <Flex justify="between" align="center" mb="3">
                  <Heading size="3">
                    {camelCaseToTitleCase(status.name)}
                  </Heading>
                  {status.name === 'open' && (
                    <AddTicketModal
                      projectId={id as string}
                      onTicketAdded={handleTicketAdded}
                    />
                  )}
                </Flex>

                {statusTickets.map((ticket) => (
                  <Ticket
                    key={ticket._id.toString()}
                    ticket={ticket}
                    assignee={
                      users.find(
                        (user) =>
                          user._id.toString() === ticket.assignee?.toString()
                      )?.name
                    }
                    column={ticket.status}
                    onClick={() => handleSelectedTicket(ticket)}
                    selected={
                      selectedTicket?._id.toString() === ticket._id.toString()
                    }
                    setDraggedFromColumn={setDraggedFromColumn}
                  />
                ))}
              </Box>
            );
          })}
        </Flex>
        <Box width="33.3%" className={styles.selectedTicketContainer}>
          {selectedTicket && (
            <SelectedTicket
              ticket={selectedTicket}
              onTicketUpdated={(updatedTicket) => {
                setTickets((prev) =>
                  prev.map((t) =>
                    t._id === updatedTicket._id ? updatedTicket : t
                  )
                );
                setSelectedTicket(updatedTicket);
              }}
              onTicketDeleted={handleTicketDeleted}
            />
          )}
        </Box>
      </Flex>
      <ProjectConfigModal
        projectId={id as string}
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        onConfigUpdated={refreshProjectData}
      />
    </Box>
  );
};

export default ProjectPage;
