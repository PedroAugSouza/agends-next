import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../shared/styles/globals.css';
import { AuthProvider } from '@/shared/contexts/auth/auth.provider';
import { DrawerCSSProvider } from '@/shared/providers/drawer-css.provider';
import { QueryClientProvider } from '@/shared/providers/query.provider';
import { CalendarProvider } from '@/shared/contexts/calendar/calendar.provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Agends',
  description: 'Se planeje melhor com o nosso app de agenda, o Agends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <DrawerCSSProvider>
            <AuthProvider>
              <CalendarProvider>{children}</CalendarProvider>
            </AuthProvider>
          </DrawerCSSProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
