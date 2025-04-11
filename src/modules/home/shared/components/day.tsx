'use client';

import { OutputGetAllEventsDTO } from '@/shared/http/http';
import { cn } from '@/shared/lib/utils';
import { setDate, setYear } from 'date-fns';

interface Props {
  displayMonth: Date;
  date: Date;
  events: OutputGetAllEventsDTO[];
}

export const Day = ({ date, displayMonth, events }: Props) => {
  const today = new Date();

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-start justify-start gap-1 p-2.5 text-gray-700',
        {
          'border-r border-gray-200': date.getDay() !== 6,
          'text-gray-400': date.getMonth() !== displayMonth.getMonth(),
        },
      )}
    >
      <span
        className={cn('flex w-9 items-center justify-between rounded px-1', {
          'bg-violet-600 text-white':
            setYear(date, displayMonth.getFullYear()).toLocaleDateString() ===
            today.toLocaleDateString(),
        })}
      >
        {date.getDate()}
        <div className="mt-0.5 size-1 rounded-full bg-white" />
      </span>

      <div className="flex w-full grow flex-col items-start justify-start gap-2 overflow-auto">
        {events.map(({ tag, uuid, name }) => (
          <div
            className="flex h-5 w-full items-center gap-2 rounded-full px-1.5 text-white"
            style={{ background: tag.color }}
            key={uuid}
          >
            <div className="size-2.5 rounded-full bg-white" />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
