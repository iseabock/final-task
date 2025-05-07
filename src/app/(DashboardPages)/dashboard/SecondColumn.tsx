import { Box, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';

import styles from './dashboard.module.css';

const SecondColumn = () => {
  return (
    <Flex
      as="div"
      flexShrink="0"
      gap="6"
      direction="column"
      width="30%"
      className={styles.currentProjects}
    >
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="2">
          Notifications
        </Heading>

        <Text as="p" size="2" mb="6" color="gray">
          Manage your notification settings.
        </Text>

        <Box>
          <Separator size="4" my="5" />
        </Box>

        <Flex direction="column">
          <Flex gap="9" align="start" justify="between">
            <Box>
              <Heading as="h4" size="3" mb="1">
                Comments
              </Heading>
              <Text as="p" size="2" color="gray">
                Receive notifications when someone comments on your documents or
                mentions you.
              </Text>
            </Box>
            <Flex direction="column" gap="4" mt="1">
              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Push</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Email</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Slack</Text>
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Box>
            <Separator size="4" my="5" />
          </Box>

          <Flex gap="9" align="start" justify="between">
            <Box>
              <Heading as="h4" size="3" mb="1">
                Favorites
              </Heading>
              <Text as="p" size="2" color="gray">
                Receive notifications when there is activity related to your
                favorited items.
              </Text>
            </Box>
            <Flex direction="column" gap="4" mt="1">
              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Push</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Email</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Slack</Text>
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Box>
            <Separator size="4" my="5" />
          </Box>

          <Flex gap="9" align="start" justify="between">
            <Box>
              <Heading as="h4" size="3" mb="1">
                New documents
              </Heading>
              <Text as="p" size="2" color="gray">
                Receive notifications whenever people on your team create new
                documents.
              </Text>
            </Box>
            <Flex direction="column" gap="4" mt="1">
              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Push</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Email</Text>
                </Text>
              </Flex>

              <Flex asChild gap="2">
                <Text as="label" size="2" weight="bold">
                  <Text>Slack</Text>
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SecondColumn;
