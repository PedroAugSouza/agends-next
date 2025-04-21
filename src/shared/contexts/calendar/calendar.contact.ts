import {
  OutputGetAllEventsDTO,
  OutputGetAllHabitsDTO,
  OutputGetAllTags,
} from '@/shared/http/http';
import { addEventSchema } from '@/shared/schemas/add-event.schema';
import { addHabitSchema } from '@/shared/schemas/add-habit.schema';
import { addTagSchema } from '@/shared/schemas/add-tag.schcema';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

export type InputCreateEvent = z.infer<typeof addEventSchema>;

export interface InputUpdateEvent extends InputCreateEvent {
  uuid: string;
}

export type InputCreateTag = z.infer<typeof addTagSchema>;

export type InputCreateHabit = infer<typeof addHabitSchema>;

export interface CalendarContextProps {
  updateEvent(input: InputCreateEvent): Promise<void>;
  createTag(input: InputCreateEvent): Promise<void>;
  createHabit(input: InputCreateEvent): Promise<void>;
  createEvent(input: InputUpdateEvent): Promise<void>;
  getEventsByDay(currentDate: Date): OutputGetAllEventsDTO[];
  events: OutputGetAllEventsDTO[] | undefined;
  tags: OutputGetAllTags[] | undefined;
  habits: OutputGetAllHabitsDTO[] | undefined;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  currentDate: Date;
  refreshEvents(): void;
  refreshTags(): void;
  refreshHabits(): void;
}
