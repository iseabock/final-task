'use client';

import { useEffect, useState } from 'react';

import { Box, Flex, Link } from '@radix-ui/themes';
import mongoose from 'mongoose';
import { useParams } from 'next/navigation';

import { IProject } from '@/db/models/Project';
import { ITicket } from '@/db/models/Ticket';
import { IUser } from '@/db/models/User';
import { useOrganization } from '@/hooks/queries/useOrganizations';

import styles from './backlog.module.css';

import { useProject } from '../../../../context/ProjectContext';
import SelectedTicket from '../SelectedTicket';
import Ticket from '../Ticket';

const BacklogPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [project, setProject] = useState<IProject>();
  const [users, setUsers] = useState<IUser[]>([]);
  const { getProject, getUsersForProject } = useProject();
  const { data: organization } = useOrganization();

  const [selectedTicket, setSelectedTicket] = useState<ITicket | undefined>();
  const params = useParams();
  const { id } = params;

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
      // Filter tickets that are in backlog status
      const backlogTickets = data.filter(
        (ticket) => ticket.status === 'backlog'
      );
      setTickets(backlogTickets);
      if (selectedTicket === undefined && backlogTickets.length > 0) {
        setSelectedTicket(backlogTickets[0]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  return (
    <Box className={styles.backlogContainer}>
      <Flex justify="between">
        <Box>
          <h1>
            <Link href="/dashboard">{organization?.name}</Link>
          </h1>
          <h2>{project?.name} - Backlog</h2>
        </Box>
      </Flex>
      <Flex gap="3">
        <Box width="66.6%">
          <Flex className={styles.ticketsContainer} gap="3" align="start">
            {tickets.map((ticket) => (
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
                setDraggedFromColumn={() => {}}
              />
            ))}
          </Flex>
        </Box>
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
    </Box>
  );
};

export default BacklogPage;
