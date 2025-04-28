'use client';

import {
  createEventControllerHandle,
  createTagsControllerHandle,
  OutputGetAllEventsDTO,
  removeAssignmentControllerHandle,
  updateEventControllerHandle,
  useGetAllEventsControllerHandle,
  useGetAllHabitsControllerHandle,
  useGetAllTagsControllerHandle,
} from '@/shared/http/http';
import { CalendarContext } from './calendar.context';
import { getSession } from '@/shared/utils/get-session';
import { setHours, setMinutes } from 'date-fns';
import {
  InputCreateEvent,
  InputCreateHabit,
  InputCreateTag,
  InputUpdateEvent,
} from './calendar.contact';
import { DEFAULT_SETTING_API } from '@/shared/constants/default-setting-api';
import { useState } from 'react';

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = getSession();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const { data: events, mutate: refreshEvents } =
    useGetAllEventsControllerHandle(
      user.uuid,
      { date: currentDate.toDateString() },
      {
        axios: DEFAULT_SETTING_API,
      },
    );

  const { data: tags, mutate: refreshTags } = useGetAllTagsControllerHandle(
    user.uuid,
    {
      axios: {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    },
  );

  const { data: habits, mutate: refreshHabits } =
    useGetAllHabitsControllerHandle(user.uuid, {
      axios: {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    });

  const removeAssignment = async (eventUuid: string, userEmail: string) => {
    await removeAssignmentControllerHandle(
      userEmail,
      eventUuid,
      DEFAULT_SETTING_API,
    );

    refreshEvents();
    return;
  };

  const createHabit = async (input: InputCreateHabit) => {};

  const createTag = async (input: InputCreateTag) => {
    await createTagsControllerHandle(
      {
        name: input.name,
        color: input.color,
        userUuid: user.uuid,
      },
      DEFAULT_SETTING_API,
    );

    refreshTags();
  };

  const createEvent = async (input: InputCreateEvent) => {
    if (input.allDay === false) {
      const startHours = setHours(input.date, Number(input.startTimeHours));
      const endHours = setHours(input.date, Number(input.endTimeHours));

      const startsTime = setMinutes(startHours, Number(input.startTimeMinutes));
      const endsTime = setMinutes(endHours, Number(input.endTimeMinutes));

      await createEventControllerHandle(
        {
          name: input.name,
          date: input.date,
          allDay: input.allDay,
          startsOf: startsTime,
          endsOf: endsTime,
          tagUuid: input.tagUuid,
          userUuid: user?.uuid,
          assignedUsers: input.asssignedUsers?.map((user) => user.user),
        },
        DEFAULT_SETTING_API,
      );
      refreshEvents();

      return;
    }

    await createEventControllerHandle(
      {
        name: input.name,
        date: input.date,
        allDay: input.allDay,
        tagUuid: input.tagUuid,
        userUuid: user?.uuid,
        endsOf: null,
        startsOf: null,
        assignedUsers: input.asssignedUsers?.map((user) => user.user),
      },
      DEFAULT_SETTING_API,
    );
    refreshEvents();
    return;
  };

  const updateEvent = async (input: InputUpdateEvent) => {
    if (!input.allDay) {
      const startHours = setHours(input.date, Number(input.startTimeHours));
      const endHours = setHours(input.date, Number(input.endTimeHours));

      const startsTime = setMinutes(startHours, Number(input.startTimeMinutes));
      const endsTime = setMinutes(endHours, Number(input.endTimeMinutes));

      await updateEventControllerHandle(
        {
          uuid: input.uuid,
          name: input.name,
          date: input.date,
          allDay: input.allDay,
          startsOf: startsTime,
          endsOf: endsTime,
          tagUuid: input.tagUuid,
        },
        DEFAULT_SETTING_API,
      );
      refreshEvents();
      return;
    }
    await updateEventControllerHandle(
      {
        uuid: input.uuid,
        name: input.name,
        date: input.date,
        allDay: input.allDay,
        tagUuid: input.tagUuid,
        endsOf: null,
        startsOf: null,
      },
      DEFAULT_SETTING_API,
    );
    refreshEvents();
    return;
  };

  const getEventsByDay = (currentDate: Date): OutputGetAllEventsDTO[] => {
    const eventsFiltered = events?.data?.filter(
      (event) =>
        new Date(event.date).getDate() === currentDate.getDate() &&
        new Date(event.date).getMonth() === currentDate.getMonth(),
    );
    return eventsFiltered ?? [];
  };

  return (
    <CalendarContext.Provider
      value={{
        removeAssignment,
        createEvent,
        createHabit,
        createTag,
        currentDate,
        getEventsByDay,
        updateEvent,
        events: events?.data,
        habits: habits?.data,
        tags: tags?.data,
        refreshHabits,
        refreshTags,
        refreshEvents,
        setCurrentDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
