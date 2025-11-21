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
  AssignUsersPayload,
  InputCreateEvent,
  InputCreateHabit,
  InputCreateTag,
  InputUpdateEvent,
  RemoveAssignmentUserPayload,
} from './calendar.contact';
import { DEFAULT_SETTING_API } from '@/shared/constants/default-setting-api';
import { useState } from 'react';
import { socket } from '@/shared/lib/socket';

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
        swr: {
          revalidateOnFocus: false,
        },
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
      swr: {
        revalidateOnFocus: false,
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
      swr: {
        revalidateOnFocus: false,
      },
    });

  const removeAssignment = (eventUuid: string, userEmail: string) => {
    socket.emit('remove-assignment', {
      eventUuid,
      ownerEmail: user.email,
      userEmail,
    } as RemoveAssignmentUserPayload);
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
          userEmail: user?.email,
        },
        DEFAULT_SETTING_API,
      ).then((response) => {
        if (!response) return;
        if (input.asssignedUsers.length) {
          socket.emit(
            'assign-users',
            input.asssignedUsers.map(
              (value) =>
                ({
                  userEmail: value.user,
                  ownerEmail: user.email,
                  eventUuid: response.data.uuid,
                }) as AssignUsersPayload,
            ),
          );
        }
      });

      refreshEvents();

      return;
    }

    await createEventControllerHandle(
      {
        name: input.name,
        date: input.date,
        allDay: input.allDay,
        tagUuid: input.tagUuid,
        userEmail: user?.email,
        endsOf: null,
        startsOf: null,
      },
      DEFAULT_SETTING_API,
    ).then((response) => {
      if (!response) return;
      if (input.asssignedUsers.length) {
        socket.emit(
          'assign-users',
          input.asssignedUsers.map(
            (value) =>
              ({
                userEmail: value.user,
                ownerEmail: user.email,
                eventUuid: response.data.uuid,
              }) as AssignUsersPayload,
          ),
        );
      }
    });
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
      ).then((response) => {
        if (!response) return;
        if (input.asssignedUsers.length) {
          console.log(
            input.asssignedUsers.filter((assign) => assign.user !== user.email),
          );
          // socket.emit(
          //   'assign-users',
          //   input.asssignedUsers.map(
          //     (value) =>
          //       ({
          //         userEmail: value.user,
          //         ownerEmail: user.email,
          //         eventUuid: response.data.uuid,
          //       }) as AssignUsersPayload,
          //   ),
          // );
        }
      });
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
    ).then((response) => {
      if (!response) return;
      if (input.asssignedUsers.length) {
        socket.emit(
          'assign-users',
          input.asssignedUsers
            .filter((assign) => assign.user !== user.email)
            .map(
              (value) =>
                ({
                  userEmail: value.user,
                  ownerEmail: user.email,
                  eventUuid: input.uuid,
                }) as AssignUsersPayload,
            ),
        );
      }
      refreshEvents();
    });
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
