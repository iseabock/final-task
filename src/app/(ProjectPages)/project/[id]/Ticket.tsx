import { Box, Heading, Text } from '@radix-ui/themes';

import { ITicket } from '@/db/models/Ticket';

import styles from './ticket.module.css';

const Ticket = ({
  ticket,
  onClick,
}: {
  ticket: ITicket;
  onClick: (ticket: ITicket) => void;
}) => {
  const handleClick = () => {
    onClick(ticket);
  };

  const priorityClass =
    styles[ticket.priority.toLowerCase() as keyof typeof styles];

  return (
    <Box className={`${styles.ticket} ${priorityClass}`} onClick={handleClick}>
      <Heading
        className={styles.heading}
        size="3"
        weight="bold"
        as="h3"
        truncate
      >
        {ticket.title}
      </Heading>
      <Text
        className={styles.description}
        size="1"
        weight="regular"
        truncate={true}
        as="div"
      >
        {ticket.description}
      </Text>
      <Box>
        <label>
          Points:
          <Text size="1" weight="bold" truncate={true}>
            {ticket.points}
          </Text>
        </label>
      </Box>
      <Box>
        <label>
          Assigned to:
          <Text size="1" weight="bold" truncate={true}>
            {ticket.assignee}
          </Text>
        </label>
      </Box>
      <Box>
        <label>
          Created by:
          <Text size="1" weight="bold" truncate={true}>
            {ticket.created_by}
          </Text>
        </label>
      </Box>
    </Box>
  );
};

export default Ticket;
