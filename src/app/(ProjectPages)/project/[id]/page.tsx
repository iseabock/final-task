'use client';

import { useEffect, useState } from 'react';

import { Box, Flex, Heading } from '@radix-ui/themes';
import { useParams } from 'next/navigation';

import { ITicket } from '@/db/models/Ticket';

import styles from './project.module.css';

import AddTicketModal from './AddTicketModal';
import SelectedTicket from './SelectedTicket';
import Ticket from './Ticket';

const ProjectPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<ITicket | undefined>();
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
      if (currentTicket === undefined && data.length > 0) {
        setCurrentTicket(data[0]);
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
  }, [id, currentTicket]);

  const handleTicketAdded = () => {
    fetchTickets();
  };

  const handleCurrentTicket = (ticket: ITicket) => {
    setCurrentTicket(ticket);
  };

  const open = tickets.filter((t) => t.status === 'open');
  const inProgress = tickets.filter((t) => t.status === 'inProgress');
  const closed = tickets.filter((t) => t.status === 'closed');

  return (
    <>
      <h1>Project Tickets</h1>
      <Flex gap="3">
        <Box width="66.6%">
          <Flex gap="3" align="start">
            <Box
              width="33.3%"
              className={`${styles.open}  ${styles.column}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'open');
              }}
            >
              <Heading size="3" mb="2">
                Open
              </Heading>

              {open?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  onClick={() => handleCurrentTicket(ticket)}
                />
              ))}
            </Box>

            <Box
              width="33.3%"
              className={`${styles.inProgress}  ${styles.column}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'inProgress');
              }}
            >
              <Heading size="3" mb="2">
                In Progress
              </Heading>
              {inProgress?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  onClick={() => handleCurrentTicket(ticket)}
                />
              ))}
            </Box>

            <Box
              width="33.3%"
              className={`${styles.done}  ${styles.column}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const ticketId = e.dataTransfer.getData('ticketId');
                updateTicketStatus(ticketId, 'closed');
              }}
            >
              <Heading size="3" mb="2">
                Done
              </Heading>
              {closed?.map((ticket) => (
                <Ticket
                  key={ticket._id.toString()}
                  ticket={ticket}
                  onClick={() => handleCurrentTicket(ticket)}
                />
              ))}
            </Box>
          </Flex>
        </Box>
        <Box width="33.3%" className={styles.currentTickets}>
          <AddTicketModal
            projectId={id as string}
            onTicketAdded={handleTicketAdded}
          />
          {currentTicket && (
            <SelectedTicket
              ticket={currentTicket}
              onTicketUpdated={(updatedTicket) => {
                setTickets((prev) =>
                  prev.map((t) =>
                    t._id === updatedTicket._id ? updatedTicket : t
                  )
                );
                setCurrentTicket(updatedTicket);
              }}
            />
          )}
        </Box>
      </Flex>
    </>
  );
};

export default ProjectPage;
