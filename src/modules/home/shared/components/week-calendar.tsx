'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useCalendar } from '@/shared/hooks/useCalendar';
import { cn } from '@/shared/lib/utils';
import { getDay, getHours, getMinutes, getWeek } from 'date-fns';
import { AddEventForm } from './add-event-form';
import { PopoverArrow } from '@radix-ui/react-popover';

export const WeekCalendar = () => {
  const { getEventsByDay, currentDate } = useCalendar();

  const getDaysInWeek = (weekNumber: number) => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstWeekday = getDay(firstDayOfYear);

    const firstDayOfWeek = new Date(
      currentYear,
      0,
      1 + (weekNumber - 1) * 7 - firstWeekday,
    );

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      return day;
    });

    return weekDays;
  };

  return (
    <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-auto px-2.5">
      <header className="flex w-full items-center border-b pr-2.5 pl-16">
        <div className="flex w-full items-end justify-end gap-2.5 px-2.5 py-2">
          {getDaysInWeek(getWeek(currentDate)).map((date) => (
            <div
              key={date.toISOString()}
              className="grid flex-1 place-items-center border-r border-gray-200 py-1.5 last:border-none"
            >
              <span
                className={cn(
                  'flex w-9 items-center justify-between rounded px-1',
                  {
                    'bg-violet-600 text-white':
                      date.toDateString() === new Date().toDateString(),
                  },
                )}
              >
                {date.getDate()}
                <div className="mt-0.5 size-1 rounded-full bg-white" />
              </span>
            </div>
          ))}
        </div>
      </header>
      <section className="flex w-full items-start justify-start overflow-auto px-2.5">
        <div className="grid h-full w-14 flex-none grid-rows-24 border-r">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="h-9 w-full flex-none text-gray-700">
              {i}h
            </div>
          ))}
        </div>

        <div className="grid h-full w-full flex-1 grid-cols-7 gap-2.5 px-2.5">
          {getDaysInWeek(getWeek(currentDate)).map((date) => (
            <div
              key={date.toISOString()}
              className="flex h-full flex-1 items-center gap-1.5 overflow-auto border-r border-gray-200 px-1.5 pr-4 last:border-none"
            >
              {getEventsByDay(date).map((event, index) => {
                const startHour = getHours(event.startsOf);
                const endHour = getHours(event.endsOf);

                const startMinutes = getMinutes(event.startsOf)
                  .toString()
                  .padStart(2, '0');
                const endMinutes = getMinutes(event.endsOf)
                  .toString()
                  .padStart(2, '0');

                return (
                  <div
                    className="grid h-full w-full min-w-20 grid-rows-24"
                    key={event.uuid}
                  >
                    <Popover>
                      <PopoverTrigger
                        className="flex h-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded-sm"
                        style={{
                          ...(event.allDay
                            ? {
                                gridRowStart: 1,
                                gridRowEnd: 25,
                              }
                            : {
                                gridRowStart: startHour + 1,
                                gridRowEnd: endHour + 2,
                              }),
                          backgroundColor: event.tag?.color + '20',
                        }}
                      >
                        <div
                          className="h-full w-2"
                          style={{ backgroundColor: event.tag?.color }}
                        />
                        <div className="flex h-full w-full flex-col items-start justify-start truncate p-1">
                          <span className="w-full truncate text-start text-gray-700">
                            {event.name}
                          </span>
                          {event.allDay ? (
                            <span className="w-full truncate text-start text-xs text-gray-500">
                              Dia Inteiro
                            </span>
                          ) : (
                            <span className="w-full truncate text-start text-xs text-gray-500">
                              {`${startHour}h${startMinutes}`}~
                              {`${endHour}h${endMinutes}`}
                            </span>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="h-max" side="right">
                        <PopoverArrow className="fill-gray-300" />
                        <AddEventForm event={event} />
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
