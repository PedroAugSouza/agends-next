'use client';
import {
  QueryClientProvider as ClientProvider,
  QueryClient,
} from '@tanstack/react-query';

const client = new QueryClient();

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ClientProvider client={client}>{children}</ClientProvider>;
};
