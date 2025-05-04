'use client';
import '@schedule-x/theme-default/dist/index.css';

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
  markAsReadNotificationControllerHandle,
  removeTagsControllerHandle,
  useGetAllNotificationsControllerHandle,
} from '@/shared/http/http';

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

import { TagForm } from './shared/components/tag-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { ptBR } from 'date-fns/locale';
import { Day } from './shared/components/day';
import { getMonth } from '@/shared/utils/getMonth';
import {
  getISOWeeksInYear,
  getWeek,
  setMonth,
  setWeek,
  setYear,
} from 'date-fns';
import { AddEventForm } from './shared/components/add-event-form';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { useCalendar } from '@/shared/hooks/useCalendar';
import { DEFAULT_SETTING_API } from '@/shared/constants/default-setting-api';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable';

import { WeekCalendar } from './shared/components/week-calendar';
import { socket } from '@/shared/lib/socket';
import { getSession } from '@/shared/utils/get-session';
import { NotificationType } from '@/shared/constants/notifications-type.constant';

export const HomeModule = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const user = getSession();

  const {
    getEventsByDay,
    tags,
    refreshTags,
    currentDate,
    setCurrentDate,
    refreshEvents,
  } = useCalendar();

  const { data: notifications, mutate: refreshNotifications } =
    useGetAllNotificationsControllerHandle(user.uuid, {
      axios: DEFAULT_SETTING_API,
    });

  const { signOut } = useAuth();

  const handleNextMonth = () => {
    if (currentDate.getMonth() === 11) {
      const newDate = setMonth(currentDate, 0);

      setCurrentDate(setYear(newDate, newDate.getFullYear() + 1));

      return;
    }

    const newDate = setMonth(currentDate, currentDate.getMonth() + 1);

    setCurrentDate(newDate);
  };
  const handlePrevMonth = () => {
    if (currentDate.getMonth() === 0) {
      const newDate = setMonth(currentDate, 11);

      setCurrentDate(setYear(newDate, newDate.getFullYear() - 1));

      return;
    }

    const newDate = setMonth(currentDate, currentDate.getMonth() - 1);

    setCurrentDate(newDate);
  };

  const handlePrevWeek = () => {
    if (getWeek(currentDate) === 0) {
      const newDate = setWeek(
        currentDate,
        getISOWeeksInYear(setYear(currentDate, currentDate.getFullYear() - 1)),
      );

      setCurrentDate(setYear(newDate, newDate.getFullYear() - 1));

      return;
    }

    const newDate = setWeek(currentDate, getWeek(currentDate) - 1);

    setCurrentDate(newDate);
  };
  const handleNextWeek = () => {
    if (getWeek(currentDate) === getISOWeeksInYear(currentDate)) {
      const newDate = setWeek(
        currentDate,
        getISOWeeksInYear(setYear(currentDate, currentDate.getFullYear() + 1)),
      );

      setCurrentDate(setYear(newDate, newDate.getFullYear() + 1));

      return;
    }

    const newDate = setWeek(currentDate, getWeek(currentDate) + 1);

    setCurrentDate(newDate);
  };

  const [toggleAddTag, setToggleAddTag] = useState(false);
  const [toggleAddHabit, setToggleAddHabit] = useState(false);

  socket.on('notification', () => {
    refreshNotifications();
    refreshEvents();
  });

  return (
    <main className="flex h-screen max-h-screen flex-col items-start justify-start overflow-hidden">
      <nav className="flex h-13 w-screen flex-none items-center justify-between border-b border-zinc-200 bg-gray-100 px-6">
        <Brand />

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger className="relative cursor-pointer">
              {notifications &&
                notifications?.data.filter(
                  (notification) => notification.isRead === false,
                )?.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-violet-500" />
                )}

              <Inbox size={24} color={colors.gray[600]} strokeWidth={1.5} />
            </PopoverTrigger>

            <PopoverContent
              className="mt-2 mr-2 flex w-80 flex-col items-start justify-start gap-1 overflow-auto p-2"
              side="left"
            >
              <h1 className="text-sm font-semibold text-gray-700">
                Notificações
              </h1>

              {notifications?.data.map((item) => {
                const sender = item.NotificationsToUSers.filter(
                  (user) => user.isSender === true,
                )[0];

                return (
                  <div
                    className="group relative flex flex-col items-start justify-start gap-0.5 border-b p-2.5 last:border-none"
                    key={item.uuid}
                  >
                    <span className="text-gray-500">
                      {item.NotificationType ===
                      NotificationType.ASSIGN_USER_TO_EVENT
                        ? `${sender.user.name} te adicionou em um novo evento.`
                        : `${sender.user.name} te removeu de um evento.`}
                    </span>
                    <div className="absolute right-3 bottom-0.5 hidden w-full justify-end group-hover:flex">
                      {item.isRead ? (
                        <span className="cursor-alias text-gray-600">Lida</span>
                      ) : (
                        <button
                          className="cursor-pointer text-gray-600"
                          onClick={() => {
                            markAsReadNotificationControllerHandle(
                              item.uuid,
                              DEFAULT_SETTING_API,
                            ).then(() => refreshNotifications());
                          }}
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="size-9 cursor-pointer rounded-full border border-gray-400">
              F
            </PopoverTrigger>
            <PopoverContent className="mr-4 flex w-max flex-col items-start justify-start gap-2.5 p-1">
              <button
                className="flex w-24 cursor-pointer items-center justify-between gap-2.5 rounded px-2 hover:bg-gray-100"
                onClick={() => signOut()}
              >
                <span>Sair</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </nav>

      <div className="flex h-full w-full flex-row items-center justify-center">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex h-full w-full"
        >
          <ResizablePanel
            className="flex h-full items-start justify-start border-r border-gray-200 bg-gray-100 px-6 py-2.5"
            defaultSize={12}
            maxSize={20}
            minSize={9}
          >
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
                  {tags?.map((tag) => (
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
                            removeTagsControllerHandle(
                              tag.uuid,
                              DEFAULT_SETTING_API,
                            ).then(() => {
                              refreshTags();
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
              {toggleAddTag && <TagForm setToggleAddTag={setToggleAddTag} />}
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
          </ResizablePanel>
          <ResizableHandle className="bg-transparent" />

          <ResizablePanel className="flex h-full flex-1 flex-col items-center pr-6 pb-2.5 pl-2.5">
            <nav className="ites-center flex h-12 w-full justify-between border-b border-gray-200 p-2">
              <div className="flex items-center">
                <span className="w-40 text-xl font-medium text-gray-600">
                  <strong className="text-gray-800">
                    {getMonth(currentDate.getMonth())}
                  </strong>{' '}
                  {currentDate.getFullYear()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    className="cursor-pointer text-violet-700"
                    onClick={
                      viewMode === 'month' ? handlePrevMonth : handlePrevWeek
                    }
                  >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                  </button>
                  <button
                    className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-violet-700"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </button>
                  <button
                    className="cursor-pointer text-violet-700"
                    onClick={
                      viewMode === 'month' ? handleNextMonth : handleNextWeek
                    }
                  >
                    <ChevronRight size={22} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  onValueChange={(value) =>
                    setViewMode(value as 'month' | 'week')
                  }
                  defaultValue="month"
                >
                  <SelectTrigger
                    className="h-8 w-32 cursor-pointer border-gray-300 p-2.5 shadow-none data-[placeholder]:text-gray-700"
                    icon={<ChevronsUpDown />}
                  >
                    <SelectValue
                      placeholder="Mês"
                      className="text-gray-600 placeholder:text-gray-600"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month" className="cursor-pointer">
                      Mês
                    </SelectItem>
                    <SelectItem value="week" className="cursor-pointer">
                      Semana
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <button className="cursor-pointer">
                      <CirclePlus
                        color={colors.gray[500]}
                        strokeWidth={1.5}
                        size={26}
                      />
                    </button>
                  </SheetTrigger>

                  <SheetContent className="w-xs border border-gray-300 p-4">
                    <SheetTitle className="font-normal text-gray-700">
                      Novo evento
                    </SheetTitle>
                    <AddEventForm />
                  </SheetContent>
                </Sheet>
              </div>
            </nav>
            <div className="flex w-full grow items-center">
              {viewMode === 'month' ? (
                <Calendar
                  className="mt-2.5 h-full p-0 pt-2.5"
                  mode="single"
                  month={currentDate}
                  locale={ptBR}
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
                    Day: (props) => (
                      <Day {...props} events={getEventsByDay(props.date)} />
                    ),
                  }}
                />
              ) : (
                <WeekCalendar />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};
