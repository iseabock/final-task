import { Button as RadixButton } from '@radix-ui/themes';

import styles from './Button.module.css';

interface ButtonProps extends React.ComponentProps<typeof RadixButton> {
  color?: 'blue' | 'green' | 'red' | 'purple';
  variant?: 'solid' | 'soft' | 'outline';
}

export function Button({
  color = 'blue',
  variant = 'solid',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  ...props
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[color]} ${styles[variant]}`;
  return <RadixButton className={buttonClass} {...props} />;
}
