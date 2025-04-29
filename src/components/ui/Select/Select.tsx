import { Select as RadixSelect } from '@radix-ui/themes';

import styles from './Select.module.css';

interface SelectProps {
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  color = 'blue',
  variant = 'solid',
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const selectClass = `${styles.select} ${styles[color]} ${styles[variant]} ${styles[size]} ${className || ''}`;

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <RadixSelect.Trigger className={selectClass} />
      <RadixSelect.Content position="popper" className={styles.content}>
        {children}
      </RadixSelect.Content>
    </RadixSelect.Root>
  );
}
