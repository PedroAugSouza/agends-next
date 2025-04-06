'use client';

import { getMonth as getMonthFNS, getYear, setMonth, setYear } from 'date-fns';
import { getMonth } from '@/shared/utils/getMonth';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ptBR } from 'date-fns/locale';
import { Calendar as ShadcnCalendar } from '../ui/calendar';
import { cn } from '@/shared/lib/utils';

interface Props {
  hasSelectMonth?: boolean;
  selected?: Date | undefined;
  onSelect?: (value: Date | undefined) => void;
}

export const Calendar = ({
  hasSelectMonth = false,
  classNames,
  selected,
  onSelect,
  className,
  ...rest
}: React.ComponentProps<typeof ShadcnCalendar> & Props) => {
  const [date, setDate] = useState<Date>(selected ? selected : new Date());

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const startsYear = getYear(new Date()) - 100;

  const currentDate = date ? date : new Date();

  const years = Array.from(
    { length: 2025 - startsYear + 1 },
    (_, i) => startsYear + i,
  ).reverse();

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(currentDate, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(currentDate, Number(year));
    setDate(newDate);
  };

  const handleSelectDate = (date: Date) => {
    setDate(date);
    onSelect && onSelect(date);
  };

  return (
    <div
      className={cn(
        className,
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-max rounded-md border p-0 shadow-md outline-hidden',
      )}
    >
      {hasSelectMonth && (
        <div className="flex w-full items-center justify-between gap-2.5 px-4 pt-3">
          <Select
            onValueChange={handleMonthChange}
            value={getMonth(getMonthFNS(currentDate))}
          >
            <SelectTrigger className="h-7 flex-1 cursor-pointer">
              <SelectValue
                className="text-gray-700"
                placeholder={getMonth(getMonthFNS(currentDate))}
              />
            </SelectTrigger>
            <SelectContent className="h-52 overflow-y-auto">
              {months.map((month) => (
                <SelectItem
                  key={month}
                  value={month.toString()}
                  className="cursor-pointer"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(currentDate).toString()}
          >
            <SelectTrigger className="h-7 flex-1 cursor-pointer">
              <SelectValue
                className="text-gray-700"
                placeholder={getYear(currentDate).toString()}
              />
            </SelectTrigger>
            <SelectContent className="h-52 overflow-y-auto">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="cursor-pointer"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ShadcnCalendar
        locale={ptBR}
        className={cn('w-max rounded-lg')}
        mode="single"
        selected={date}
        classNames={{
          day_selected:
            'bg-violet-600 text-white hover:bg-violet-500 hover:text-white',
          cell: 'size-10',
          head_cell: 'w-10 font-normal',
          ...(hasSelectMonth && { nav: 'hidden' }),
          ...classNames,
        }}
        month={date}
        onSelect={(value) => handleSelectDate(value!)}
        disabled={rest.disabled}
      />
    </div>
  );
};
