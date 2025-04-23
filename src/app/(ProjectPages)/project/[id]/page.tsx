'use client';

import { useEffect, useState } from 'react';

import { Box, Flex, Heading, Link } from '@radix-ui/themes';
import mongoose from 'mongoose';
import { useParams } from 'next/navigation';

import { IProject } from '@/db/models/Project';
import { ITicket } from '@/db/models/Ticket';
import { useOrganization } from '@/hooks/queries/useOrganizations';

import styles from './project.module.css';

import { useProject } from '../../../context/ProjectContext';
import AddTicketModal from './AddTicketModal';
import SelectedTicket from './SelectedTicket';
import Ticket from './Ticket';

const ProjectPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [project, setProject] = useState<IProject>();
  const [draggingOverColumn, setDraggingOverColumn] = useState<string | null>(
    null
  );
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(
    null
  );
  const { getProject } = useProject();
  const {
    data: organization,
    // isLoading: isLoadingOrg,
    // error: orgError,
  } = useOrganization();

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
        throw new Error('Failed to fetch project');
      }

      const data: ITicket[] = await res.json();
      setTickets(data);
      if (selectedTicket === undefined && data.length > 0) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error(error);
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

  const open = tickets.filter((t) => t.status === 'open');
  const inProgress = tickets.filter((t) => t.status === 'inProgress');
  const closed = tickets.filter((t) => t.status === 'closed');

  useEffect(() => {
    const loadProject = async () => {
      const data = await getProject(
        id as unknown as mongoose.Schema.Types.ObjectId
      );
      setProject(data as IProject);
    };
    loadProject();
  }, [id, getProject]);

  return (
    <>
      <h1>{project?.name}</h1>
      <h2>
        <Link href="/dashboard">{organization?.name}</Link>
      </h2>
      <AddTicketModal
        projectId={id as string}
        onTicketAdded={handleTicketAdded}
      />
      <Flex className={styles.projectContainer} gap="3">
        <Box width="66.6%">
          <Flex className={styles.ticketsContainer} gap="3" align="start">
            <Box
              width="33.3%"
              className={`${styles.open} ${styles.column} ${
                draggingOverColumn === 'open' && draggedFromColumn !== 'open'
                  ? styles.dragOver
                  : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingOverColumn('open');
              }}
              onDragLeave={() => setDraggingOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'open');
                setDraggingOverColumn(null);
              }}
            >
              <Heading size="3" mb="2">
                Open
              </Heading>

              {open?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  column={ticket.status}
                  onClick={() => handleSelectedTicket(ticket)}
                  selected={
                    selectedTicket?._id.toString() === ticket._id.toString()
                  }
                  setDraggedFromColumn={setDraggedFromColumn}
                />
              ))}
            </Box>

            <Box
              width="33.3%"
              className={`${styles.inProgress} ${styles.column} ${
                draggingOverColumn === 'inProgress' &&
                draggedFromColumn !== 'inProgress'
                  ? styles.dragOver
                  : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingOverColumn('inProgress');
              }}
              onDragLeave={() => setDraggingOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'inProgress');
                setDraggingOverColumn(null);
              }}
            >
              <Heading size="3" mb="2">
                In Progress
              </Heading>
              {inProgress?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  column={ticket.status}
                  onClick={() => handleSelectedTicket(ticket)}
                  selected={
                    selectedTicket?._id.toString() === ticket._id.toString()
                  }
                  setDraggedFromColumn={setDraggedFromColumn}
                />
              ))}
            </Box>

            <Box
              width="33.3%"
              className={`${styles.closed} ${styles.column} ${
                draggingOverColumn === 'closed' &&
                draggedFromColumn !== 'closed'
                  ? styles.dragOver
                  : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingOverColumn('closed');
              }}
              onDragLeave={() => setDraggingOverColumn(null)}
              onDrop={(e) => {
                e.preventDefault();
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'closed');
                setDraggingOverColumn(null);
              }}
            >
              <Heading size="3" mb="2">
                Done
              </Heading>
              {closed?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  column={ticket.status}
                  onClick={() => handleSelectedTicket(ticket)}
                  selected={
                    selectedTicket?._id.toString() === ticket._id.toString()
                  }
                  setDraggedFromColumn={setDraggedFromColumn}
                />
              ))}
            </Box>
          </Flex>
        </Box>
        <Box width="33.3%" className={styles.currentTickets}>
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
    </>
  );
};

export default ProjectPage;
