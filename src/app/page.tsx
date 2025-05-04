'use client';

import { HomeModule } from '@/modules/home';
import { CalendarProvider } from '@/shared/contexts/calendar/calendar.provider';
import { socket } from '@/shared/lib/socket';

export default function Home() {
  socket.on('connect', () => {});
  return (
    <CalendarProvider>
      <HomeModule />
    </CalendarProvider>
  );
}
