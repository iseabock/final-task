import { Box } from '@radix-ui/themes';

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

  return (
    <Box className={styles.ticket} onClick={handleClick}>
      {ticket.title}
    </Box>
  );
};

export default Ticket;
