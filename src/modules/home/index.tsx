'use client';

import { Brand } from '@/shared/components/common/brand';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

import {
  removeTagsControllerHandle,
  useGetAllHabitsControllerHandle,
  useGetAllTagsControllerHandle,
} from '@/shared/http/http';

import { getSession } from '@/shared/utils/get-session';

import { AccordionHeader } from '@radix-ui/react-accordion';
import { PopoverArrow } from '@radix-ui/react-popover';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleEllipsis,
  CirclePlus,
  Inbox,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

import colors from 'tailwindcss/colors';

import { TagForm } from './components/tag-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { ptBR } from 'date-fns/locale';
import { Day } from './components/day';
import { getMonth } from '@/shared/utils/getMonth';
import { setMonth, setYear } from 'date-fns';

export const HomeModule = () => {
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

  const user = getSession();

  const [date, setDate] = useState<Date>(new Date());

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleNextMonth = () => {
    if (date.getMonth() === 11) {
      const newDate = setMonth(date, 0);

      setDate(setYear(newDate, newDate.getFullYear() + 1));

      return;
    }

    const newDate = setMonth(date, date.getMonth() + 1);

    setDate(newDate);
  };
  const handlePrevMonth = () => {
    if (date.getMonth() === 0) {
      const newDate = setMonth(date, 11);

      setDate(setYear(newDate, newDate.getFullYear() - 1));

      return;
    }

    const newDate = setMonth(date, date.getMonth() - 1);

    setDate(newDate);
  };

  const [toggleAddTag, setToggleAddTag] = useState(false);
  const [toggleAddHabit, setToggleAddHabit] = useState(false);

  const { data: tags, mutate: mutateTags } = useGetAllTagsControllerHandle(
    user.uuid,
    {
      axios: {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    },
  );

  const { data: habits, mutate: mutateHabits } =
    useGetAllHabitsControllerHandle(user.uuid, {
      axios: {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    });

  return (
    <main className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <nav className="z-10 flex h-13 w-screen items-center justify-between border-b border-zinc-200 bg-gray-100 px-6">
        <Brand />

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger className="cursor-pointer">
              <Inbox size={24} color={colors.gray[600]} strokeWidth={1.5} />
            </PopoverTrigger>
            <PopoverContent
              className="mt-2 mr-2 flex w-80 flex-col items-start justify-start gap-2.5 p-2"
              side="left"
            >
              <h1 className="text-sm font-semibold text-gray-700">
                Notificações
              </h1>
              <div className="flex flex-col items-start justify-start gap-1 rounded-md bg-gray-100 p-2.5">
                <h1 className="text-sm font-semibold text-gray-700">
                  Erick Willyan
                </h1>
                <span className="text-gray-500">
                  Erick Willyan te adicionou no evento “Apresentar seminário”.
                </span>
              </div>
            </PopoverContent>
          </Popover>

          <button className="size-9 rounded-full border border-gray-400">
            F
          </button>
        </div>
      </nav>
      <div className="flex h-full w-full flex-row items-center justify-center">
        <div className="flex h-full w-80 items-start justify-start border-r border-gray-200 bg-gray-100 px-6 py-2.5">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['item-1', 'item-2']}
          >
            <AccordionItem value="item-1">
              <AccordionHeader className="flex flex-row items-center justify-between">
                <span className="text-base font-semibold text-gray-700">
                  Minha agenda
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <button
                    onClick={() => setToggleAddTag(!toggleAddTag)}
                    className="cursor-pointer"
                  >
                    {toggleAddTag ? <Minus size={22} /> : <Plus size={22} />}
                  </button>

                  <AccordionTrigger className="group w-full cursor-pointer items-center justify-between">
                    <ChevronDown
                      size={22}
                      className="transition-all group-data-[state=open]:rotate-180"
                    />
                  </AccordionTrigger>
                </div>
              </AccordionHeader>
              <AccordionContent className="flex flex-col items-center gap-1">
                {tags?.data.map((tag) => (
                  <Popover key={tag.uuid}>
                    <PopoverTrigger className="group flex w-full cursor-pointer items-center justify-between rounded border border-transparent px-2 py-1 hover:bg-white data-[state=open]:border-gray-200 data-[state=open]:bg-white">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm font-normal text-gray-700">
                          {tag.name}
                        </span>
                      </div>
                      <CircleEllipsis
                        size={20}
                        strokeWidth={1.5}
                        color={colors.gray[600]}
                        className="hidden group-hover:flex group-data-[state=open]:flex"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      className="flex w-fit flex-col items-start justify-start gap-2.5 p-1"
                    >
                      <PopoverArrow className="fill-white" />
                      <Button
                        size="sm"
                        className="cursor-pointer rounded bg-gray-50 text-zinc-700 hover:bg-gray-100"
                        onClick={() =>
                          removeTagsControllerHandle(tag.uuid, {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          }).then(() => {
                            mutateHabits();
                          })
                        }
                      >
                        Excluir
                      </Button>
                    </PopoverContent>
                  </Popover>
                ))}
              </AccordionContent>
            </AccordionItem>
            {toggleAddTag && (
              <TagForm
                mutateTags={mutateTags}
                setToggleAddTag={setToggleAddTag}
              />
            )}
            {/* <AccordionItem value="item-2">
              <AccordionHeader className="flex flex-row items-center justify-between">
                <span className="text-base font-semibold text-gray-700">
                  Meus hábitos
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <button>
                    <Plus size={22} />
                  </button>

                  <AccordionTrigger className="group w-full cursor-pointer items-center justify-between">
                    <ChevronDown
                      size={22}
                      className="transition-all group-data-[state=open]:rotate-180"
                    />  
                  </AccordionTrigger>
                </div>
              </AccordionHeader>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
        <div className="flex h-full flex-1 flex-col items-center pr-6 pb-2.5 pl-2.5">
          <nav className="ites-center flex h-12 w-full justify-between border-b border-gray-200 p-2">
            <div className="flex items-center gap-3">
              <span className="w-40 text-xl font-medium text-gray-600">
                <strong className="text-gray-800">
                  {getMonth(date.getMonth())}
                </strong>{' '}
                {date.getFullYear()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  className="cursor-pointer text-violet-700"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-violet-700">
                  Hoje
                </button>
                <button
                  className="cursor-pointer text-violet-700"
                  onClick={handleNextMonth}
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select>
                <SelectTrigger
                  className="h-8 w-32 border-gray-300 p-2.5 shadow-none data-[placeholder]:text-gray-600"
                  icon={<ChevronsUpDown />}
                >
                  <SelectValue
                    placeholder="Mês"
                    className="text-gray-600 placeholder:text-gray-600"
                  />
                </SelectTrigger>
              </Select>
              <button>
                <CirclePlus
                  color={colors.gray[500]}
                  strokeWidth={1.5}
                  size={26}
                />
              </button>
            </div>
          </nav>
          <div className="flex w-full grow items-center">
            <Calendar
              className="mt-2.5 h-full p-0 pt-2.5"
              mode="single"
              month={date}
              // selected={date}
              locale={ptBR}
              showOutsideDays
              fixedWeeks
              classNames={{
                nav: 'hidden',
                caption: 'hidden',
                month: 'w-full grow h-full',
                root: 'w-full h-full',
                table: 'w-full grow  h-full flex flex-col h-full',
                tbody: 'flex flex-wrap grow justify-between ',
                head: 'w-full',
                head_row:
                  ' w-full grid grid-cols-7 border-b pb-2.5 border-gray-200',
                head_cell:
                  'border-r last:border-none border-gray-200 text-gray-600 w-full items-start flex p-2.5 font-semibold capitalize',
                cell: 'flex w-full items-center justify-between grow h-full',
                day: cn(
                  buttonVariants({ variant: 'ghost' }),
                  'flex-1 h-full  p-0 font-normal aria-selected:opacity-100',
                ),
                months: ' h-full',
              }}
              components={{
                Day: (props) => <Day {...props} />,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
