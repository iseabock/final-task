import React from 'react';

import { Dialog, Flex } from '@radix-ui/themes';

import styles from './confirmationDialog.module.css';

import { Button } from '../ui/Button/Button';

interface IConfirmationDialog {
  title: string;
  triggerText: React.ReactNode;
  message: string;
  confirmText: string;
  type?: string;
  size?: string;
  onConfirm: () => void;
  className?: string;
}

const ConfirmationDialog = ({
  triggerText,
  title,
  message,
  confirmText,
  type = 'delete',
  size = 'normal',
  onConfirm,
  className,
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
          <Button
            size="sm"
            variant="solid"
            color="red"
            className={`${triggerClass} ${sizeClass} ${className}`}
          >
            {triggerText}
          </Button>
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
            <Button variant="soft">Cancel</Button>
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
