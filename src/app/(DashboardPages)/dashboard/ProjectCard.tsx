import { Badge, Link, Table } from '@radix-ui/themes';

import { IProject } from '@/db/models/Project';
import { useTickets } from '@/hooks/queries/useTickets';

const ProjectCard = ({ project }: { project: IProject }) => {
  const {
    data: tickets,

    // isLoading: isLoadingTickets,
    // error: ticketsError,
  } = useTickets(project._id.toString());

  const openTickets = tickets?.filter((ticket) => ticket.status === 'open');
  const inProgressTickets = tickets?.filter(
    (ticket) => ticket.status === 'inProgress'
  );
  const closedTickets = tickets?.filter((ticket) => ticket.status === 'closed');

  return (
    <>
      <Table.Cell>
        <Link href={`/project/${project._id}`}>{project.name}</Link>
      </Table.Cell>
      <Table.Cell>
        <Badge color="green">{openTickets?.length} open</Badge>
      </Table.Cell>
      <Table.Cell>
        <Badge color="yellow">{inProgressTickets?.length} in progress</Badge>
      </Table.Cell>

      <Table.Cell>
        <Badge color="red">{closedTickets?.length} closed</Badge>
      </Table.Cell>
    </>
  );
};

export default ProjectCard;
