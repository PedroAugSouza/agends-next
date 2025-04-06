'use client';

import { cn } from '@/shared/lib/utils';
import { setDate } from 'date-fns';

interface Props {
  displayMonth: Date;
  date: Date;
}

export const Day = ({ date, displayMonth }: Props) => {
  const today = new Date();
  const currentDate = setDate(today, date.getDate());

  return (
    <div
      className={cn(
        'flex h-full w-full items-start justify-start p-2.5 text-gray-700',
        {
          'border-r border-gray-200': date.getDay() !== 6,
          'text-gray-400': date.getMonth() !== displayMonth.getMonth(),
        },
      )}
    >
      <span
        className={cn('flex w-9 items-center justify-between rounded px-1', {
          'bg-violet-600 text-white':
            currentDate.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            displayMonth.getFullYear() === today.getFullYear(),
        })}
      >
        {date.getDate()}
        <div className="mt-0.5 size-1 rounded-full bg-white" />
      </span>
    </div>
  );
};
