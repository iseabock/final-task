import { Card, Flex, Heading } from '@radix-ui/themes';

const ThirdColumn = () => {
  return (
    <Flex
      as="div"
      flexShrink="0"
      gap="6"
      direction="column"
      style={{ width: 'calc(30% - var(--space-6))' }}
    >
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          Something else
        </Heading>
      </Card>
    </Flex>
  );
};

export default ThirdColumn;
