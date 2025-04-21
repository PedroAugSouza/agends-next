import { OutputGetAllEventsDTO } from '@/shared/http/http';
import { addEventSchema } from '@/shared/schemas/add-event.schema';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

export type InputCreateEvent = z.infer<typeof addEventSchema>;

export interface InputUpdateEvent extends InputCreateEvent {
  uuid: string;
}

export interface CalendarContextProps {
  updateEvent(input: InputCreateEvent): Promise<void>;
  createEvent(input: InputUpdateEvent): Promise<void>;
  events: OutputGetAllEventsDTO[] | undefined;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  refreshEvents(): void;
}
