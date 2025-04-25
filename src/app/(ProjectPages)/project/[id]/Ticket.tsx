import { Box, Heading, Text } from '@radix-ui/themes';
import { Bug } from 'lucide-react';

import { ITicket } from '@/db/models/Ticket';

import styles from './ticket.module.css';

const Ticket = ({
  ticket,
  column,
  assignee,
  onClick,
  selected = false,
  setDraggedFromColumn,
}: {
  ticket: ITicket;
  column: string;
  assignee?: string;
  onClick: (ticket: ITicket) => void;
  selected: boolean;
  setDraggedFromColumn: (column: string) => void;
}) => {
  const handleClick = () => {
    onClick(ticket);
  };

  const priorityClass =
    styles[ticket.priority.toLowerCase() as keyof typeof styles];
  const typeClass = styles[ticket.type.toLowerCase() as keyof typeof styles];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('ticketId', ticket._id.toString());
    setDraggedFromColumn(column);
  };

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      className={`${styles.ticket} ${priorityClass} ${typeClass} ${selected && styles.selected}`}
      onClick={handleClick}
    >
      <Heading
        className={styles.heading}
        size="3"
        weight="bold"
        as="h3"
        truncate
      >
        {ticket.type === 'bug' && <Bug size={14} className={styles.bugIcon} />}{' '}
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
      <div className={styles.ticketMeta}>
        <strong>{ticket.points}pts</strong>
        <span>{assignee ? assignee : 'Unassigned'}</span>
      </div>
    </Box>
  );
};

export default Ticket;
