import {
  createEventControllerHandle,
  updateEventControllerHandle,
  useGetAllEventsControllerHandle,
} from '@/shared/http/http';
import { CalendarContext } from './calendar.context';
import { getSession } from '@/shared/utils/get-session';
import { setHours, setMinutes } from 'date-fns';
import { InputCreateEvent, InputUpdateEvent } from './calendar.contact';
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
      { date: currentDate.toISOString() },
      {
        axios: DEFAULT_SETTING_API,
      },
    );

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
          date: input.date.toISOString(),
          allDay: input.allDay,
          startsOf: startsTime.toISOString(),
          endsOf: endsTime.toISOString(),
          tagUuid: input.tagUuid,
        },
        DEFAULT_SETTING_API,
      );

      return;
    }
    await updateEventControllerHandle(
      {
        uuid: input.uuid,
        name: input.name,
        date: input.date.toISOString(),
        allDay: input.allDay,
        tagUuid: input.tagUuid,
        endsOf: null,
        startsOf: null,
      },
      DEFAULT_SETTING_API,
    );
    return;
  };

  return (
    <CalendarContext.Provider
      value={{
        createEvent,
        updateEvent,
        events: events?.data,
        refreshEvents,
        setCurrentDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
