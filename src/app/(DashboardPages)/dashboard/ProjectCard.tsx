import { Badge, Flex, Link, Table } from '@radix-ui/themes';

import { IProject } from '@/db/models/Project';
import { useTickets } from '@/hooks/queries/useTickets';

const ProjectCard = ({ project }: { project: IProject }) => {
  const {
    data: tickets,

    // isLoading: isLoadingTickets,
    // error: ticketsError,
  } = useTickets(project._id ?? '');

  const openTickets = tickets?.filter((ticket) => ticket.status === 'open');
  const inProgressTickets = tickets?.filter(
    (ticket) => ticket.status === 'inProgress'
  );
  const closedTickets = tickets?.filter((ticket) => ticket.status === 'closed');

  return (
    <>
      <Table.RowHeaderCell>
        <Link href={`/project/${project._id}`}>{project.name}</Link>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Flex>
          <Badge color="green">{openTickets?.length} open</Badge>
          <Badge color="yellow">{inProgressTickets?.length} in progress</Badge>
          <Badge color="red">{closedTickets?.length} closed</Badge>
        </Flex>
      </Table.Cell>
    </>
  );
};

export default ProjectCard;
