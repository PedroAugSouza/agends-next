import { HomeModule } from '@/modules/home';
import { CalendarProvider } from '@/shared/contexts/calendar/calendar.provider';

export default function Home() {
  return (
    <CalendarProvider>
      <HomeModule />
    </CalendarProvider>
  );
}
