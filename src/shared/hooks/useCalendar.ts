import { useContext } from 'react';
import { CalendarContext } from '../contexts/calendar/calendar.context';

export const useCalendar = () => useContext(CalendarContext);
