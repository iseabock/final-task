'use client';

import { useState } from 'react';

import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Text,
} from '@radix-ui/themes';
import { Session } from 'next-auth';

import AddOrganizationModal from '@/components/AddOrganizationModal';
import { IOrganization } from '@/db/models/Organization';

export default function FirstColumn({
  session,
  organization,
}: {
  session: Session;
  organization?: IOrganization;
}) {
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);

  return (
    <Flex
      flexShrink="0"
      gap="6"
      direction="column"
      style={{ width: 'calc(40% - var(--space-6))' }}
    >
      <Card size="4">
        <div>
          {organization ? (
            <div>
              <h1>{organization.name} Dashboard</h1>
              {organization.description && <p>{organization.description}</p>}
              {organization.owner.toString() === session?.user?.id && (
                <>
                  <span>{session.user.name}</span>
                  <span>Owner</span>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                You are not part of any organization. Create one to get started.
              </p>
              <AddOrganizationModal
                open={isAddOrgModalOpen}
                onOpenChange={setIsAddOrgModalOpen}
              />
            </div>
          )}
        </div>
      </Card>

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

      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="2">
          Pricing
        </Heading>

        <Text as="p" size="2" mb="5" color="gray">
          No credit card required. Every plan includes a 30-day trial of all Pro
          features.
        </Text>

        <Grid columns="3" gap="6">
          <Flex direction="column">
            <Text weight="bold" size="5" mb="1">
              Basic
            </Text>
            <Text color="gray" size="2" mb="4">
              3 team members
            </Text>
            <Text weight="bold" size="5" mb="4">
              $0
              <Text size="5" weight="bold" style={{ color: 'var(--gray-a8)' }}>
                {' / mo'}
              </Text>
            </Text>

            <Flex direction="column" gap="2"></Flex>
          </Flex>

          <Flex direction="column">
            <Text weight="bold" size="5" mb="1">
              Growth
            </Text>
            <Text color="gray" size="2" mb="4">
              10 team members
            </Text>
            <Text weight="bold" size="5" mb="4">
              $49
              <Text size="5" weight="bold" style={{ color: 'var(--gray-a8)' }}>
                {' / mo'}
              </Text>
            </Text>

            <Flex direction="column" gap="2"></Flex>
          </Flex>

          <Flex direction="column">
            <Text weight="bold" size="5" mb="1">
              Pro
            </Text>
            <Text color="gray" size="2" mb="4">
              Unlimited team members
            </Text>
            <Text weight="bold" size="5" mb="4">
              $99
              <Text size="5" weight="bold" style={{ color: 'var(--gray-a8)' }}>
                {' / mo'}
              </Text>
            </Text>

            <Flex direction="column" gap="2"></Flex>
          </Flex>
        </Grid>
      </Card>
    </Flex>
  );
}
