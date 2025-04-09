'use client';

import { useEffect, useState } from 'react';

import { Box, Flex } from '@radix-ui/themes';
import { useParams } from 'next/navigation';

import { ITicket } from '@/db/models/Ticket';

import styles from './project.module.css';

import AddTicketModal from './AddTicketModal';

const ProjectPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>();
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTicketAdded = () => {
    fetchTickets();
  };

  return (
    <>
      <h1>Projects</h1>
      <Flex gap="3">
        <Box width="20%" className={styles.box}>
          <AddTicketModal
            projectId={id as string}
            onTicketAdded={handleTicketAdded}
          />
        </Box>
        <Box width="60%" className={styles.box}>
          <ul>
            {tickets?.map((ticket, index) => (
              <li key={index}>
                <h2>{ticket.title}</h2>
                <p>{ticket.status}</p>
              </li>
            ))}
          </ul>
        </Box>
        <Box width="20%" className={styles.box}>
          Column 3
        </Box>
      </Flex>
    </>
  );
};

export default ProjectPage;
