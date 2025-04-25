import { Button as RadixButton } from '@radix-ui/themes';

import styles from './Button.module.css';

interface ButtonProps
  extends Omit<React.ComponentProps<typeof RadixButton>, 'size'> {
  color?: 'blue' | 'green' | 'red' | 'purple';
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Button({
  color = 'blue',
  variant = 'solid',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[color]} ${styles[variant]} ${styles[size]} ${className || ''}`;
  return <RadixButton className={buttonClass} {...props} />;
}
