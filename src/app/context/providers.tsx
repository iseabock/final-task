'use client';

import { SessionProvider } from 'next-auth/react';

import { OrganizationProvider } from './OrganizationContext';
import { ProjectProvider } from './ProjectContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OrganizationProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </OrganizationProvider>
    </SessionProvider>
  );
}
