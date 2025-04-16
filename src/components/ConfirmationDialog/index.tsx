import React from 'react';

import { Button, Dialog, Flex } from '@radix-ui/themes';

import styles from './confirmationDialog.module.css';

interface IConfirmationDialog {
  // isOpen: boolean;
  title: string;
  triggerText: React.ReactNode;
  message: string;
  confirmText: string;
  type?: string;
  onConfirm: () => void;
  // onCancel: () => void;
}

const ConfirmationDialog = ({
  // isOpen,
  triggerText,
  title,
  message,
  confirmText,
  type = 'delete',
  onConfirm,
  // onCancel,
}: IConfirmationDialog) => {
  // if (!isOpen) {
  //   return null;
  // }

  console.log('type', type);

  const handleDelete = () => {
    onConfirm();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className={styles.delete}>{triggerText}</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {message}
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleDelete}>{confirmText}</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmationDialog;
