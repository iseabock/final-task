import { useCallback } from 'react';

export const useDeleteTicket = (onTicketDeleted: (id: string) => void) => {
  return useCallback(
    async (ticketId: string, projectId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/tickets`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketId),
          }
        );

        if (!response.ok) {
          const message = `Error: ${response.status}`;
          throw new Error(message);
        }

        onTicketDeleted(ticketId);
      } catch (error) {
        console.error('There was an error deleting the item:', error);
      }
    },
    [onTicketDeleted]
  );
};

// try {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${state.projectId}/tickets`,
//     {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(ticket._id),
//     }
//   );

//   onTicketDeleted(ticket._id.toString());

//   if (!response.ok) {
//     const message = `Error: ${response.status}`;
//     throw new Error(message);
//   }
// } catch (error) {
//   // Handle errors (e.g., display error message)
//   console.error('There was an error deleting the item:', error);
// }
