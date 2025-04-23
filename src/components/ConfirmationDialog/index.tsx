import React from 'react';

import { Button, Dialog, Flex, IconButton } from '@radix-ui/themes';

import styles from './confirmationDialog.module.css';

interface IConfirmationDialog {
  // isOpen: boolean;
  title: string;
  triggerText: React.ReactNode;
  message: string;
  confirmText: string;
  type?: string;
  size?: string;
  onConfirm: () => void;
}

const ConfirmationDialog = ({
  triggerText,
  title,
  message,
  confirmText,
  type = 'delete',
  size = 'normal',
  onConfirm,
}: IConfirmationDialog) => {
  const handleDelete = () => {
    onConfirm();
  };

  const triggerClass = styles[type.toLowerCase() as keyof typeof styles];
  const sizeClass = styles[size.toLowerCase() as keyof typeof styles];

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {type === 'delete' ? (
          <IconButton className={`${triggerClass} ${sizeClass}`}>
            {triggerText}
          </IconButton>
        ) : (
          <Button className={`${triggerClass} ${sizeClass}`}>
            {triggerText}
          </Button>
        )}
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
