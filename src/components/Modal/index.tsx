import { ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/Button/Button';

import styles from './modal.module.css';

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

function ModalContent({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.dialogOverlay} />
      <Dialog.Content className={styles.dialogContent}>
        <div className={styles.header}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>
        </div>
        <div className={styles.body}>{children}</div>
        <Dialog.Close asChild>
          <Button variant="soft" className={styles.closeButton}>
            <Cross1Icon />
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

Modal.Trigger = Dialog.Trigger;
Modal.Content = ModalContent;

// {/* Button to Open Dialog */}
// <Dialog.Trigger asChild>
// <Button variant="solid">Add User</Button>
// </Dialog.Trigger>

// {/* Dialog Modal */}
// <Dialog.Portal>
// {/* Background Overlay */}
// <Dialog.Overlay className="dialog-overlay" />
// <Dialog.Content className="dialog-content">

//     <Dialog.Title className="text-xl font-bold">Add New User</Dialog.Title>
//     <Dialog.Description className="text-sm mb-4">
//         Enter user details below.
//     </Dialog.Description>

//     {/* Close Button */}
//     <Dialog.Close asChild>
//         <Button className="absolute top-2 right-2">X</Button>
//     </Dialog.Close>
// </Dialog.Content>
// </Dialog.Portal>
