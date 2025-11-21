'use client';
import {
  AlarmClockCheck,
  Calendar as CalendarIcon,
  Check,
  Plus,
  User,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ChevronsUpDown } from 'lucide-react';
import colors from 'tailwindcss/colors';
import { Calendar } from '@/shared/components/common/custom-calendar';
import { format, set, setDate, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Switch } from '@/shared/components/ui/switch';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import {
  createEventControllerHandle,
  OutputGetAllEventsDTO,
  updateEventControllerHandle,
  useGetAllTagsControllerHandle,
} from '@/shared/http/http';
import { getSession } from '@/shared/utils/get-session';
import {
  Controller,
  useForm,
  useFieldArray,
  SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';
import { addEventSchema } from '@/shared/schemas/add-event.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/lib/utils';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import { useState } from 'react';
import { useCalendar } from '@/shared/hooks/useCalendar';
import { DEFAULT_SETTING_API } from '@/shared/constants/default-setting-api';
import { socket } from '@/shared/lib/socket';

type FormType = z.infer<typeof addEventSchema>;

interface TagType {
  uuid: string;
  name: string;
  color: string;
}

interface Props {
  event?: OutputGetAllEventsDTO;
}

export const AddEventForm = ({ event }: Props) => {
  const { createEvent, updateEvent, refreshEvents, removeAssignment } =
    useCalendar();

  const { register, control, handleSubmit, watch } = useForm<FormType>({
    resolver: zodResolver(addEventSchema),

    defaultValues: {
      allDay: false,
      ...(event && {
        asssignedUsers: event.assignedEventToUsers.map((user) => ({
          user: user.user.email,
        })),
        name: event.name,
        date: new Date(event.date),
        allDay: event.allDay,
        tagUuid: JSON.stringify({
          uuid: event.tag.uuid,
          name: event.tag.name,
          color: event.tag.color,
        }),
        endTimeHours: new Date(event.endsOf).getHours().toString(),
        endTimeMinutes: new Date(event.endsOf)
          .getMinutes()
          .toString()
          .padStart(2, '0'),
        startTimeHours: new Date(event.startsOf).getHours().toString(),
        startTimeMinutes: new Date(event.startsOf)
          .getMinutes()
          .toString()
          .padStart(2, '0'),
      }),
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'asssignedUsers',
  });

  const user = getSession();

  const { data: tags } = useGetAllTagsControllerHandle(
    event
      ? event?.assignedEventToUsers.filter(
          (assign) => assign.isOwner === true,
        )[0]?.user.uuid
      : user.uuid,
    {
      axios: DEFAULT_SETTING_API,
      swr: {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        revalidateOnReconnect: false,
      },
    },
  );
  const [open, setOpen] = useState(false);

  const [inputValue, setInputValue] = useState<string>('');

  const mails = [
    {
      value: '@gmail.com',
      label: '@gmail.com',
    },
    {
      value: '@hotmail.com',
      label: '@hotmail.com',
    },
    {
      value: '@yahoo.com',
      label: '@yahoo.com',
    },
    {
      value: '@icloud.com',
      label: '@icloud.com',
    },
  ];

  const tagSelected: TagType = watch('tagUuid')
    ? JSON.parse(watch('tagUuid'))
    : {};

  const onSubmit: SubmitHandler<FormType> = (data) => {
    if (event) {
      updateEvent({
        ...data,
        tagUuid: tagSelected.uuid,
        uuid: event.uuid,
      });
    } else {
      createEvent({ ...data, tagUuid: tagSelected.uuid });
    }
  };

  const handleRemoveAssign = (
    index?: number,
    userEmail?: string,
    eventUuid?: string,
  ) => {
    if (event) {
      removeAssignment(eventUuid!, userEmail!);
      refreshEvents();
    } else {
      remove(index);
    }
  };

  const thisUserIsOwner = event
    ? event.assignedEventToUsers?.filter(
        (assign) => assign.user.uuid === user.uuid,
      )[0].isOwner
    : true;

  const fieldsFiltered = watch('asssignedUsers')
    ? watch('asssignedUsers').filter(
        (value) =>
          value.user !==
            event?.assignedEventToUsers?.filter(
              (assigned) => assigned.isOwner,
            )[0]?.user?.email || '',
      )
    : fields;

  return (
    <form
      className="flex w-full flex-col items-start justify-between gap-2.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={cn('flex w-full flex-col items-start gap-2.5', {
          'h-max text-zinc-400 **:cursor-not-allowed': !thisUserIsOwner,
          'h-max': thisUserIsOwner,
        })}
      >
        <div className="flex w-full items-center gap-2.5">
          <div
            className="size-3 rounded-full"
            style={{ background: tagSelected.color }}
          />
          <input
            type="text"
            className="border-none bg-white/60 outline-none placeholder:italic"
            placeholder="Nome do evento"
            disabled={!thisUserIsOwner}
            {...register('name')}
          />
        </div>

        <Controller
          control={control}
          name="tagUuid"
          disabled={!thisUserIsOwner}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger
                icon={<ChevronsUpDown />}
                disabled={!thisUserIsOwner}
                defaultValue={field.value}
                type="button"
                className="w-full cursor-pointer border-gray-300 bg-white/60"
              >
                <SelectValue placeholder="Selecione uma etiqueta" />
              </SelectTrigger>

              <SelectContent className="flex flex-col items-center gap-2 bg-white/60 backdrop-blur-[4px]">
                {tags?.data.map((tag) => (
                  <SelectItem
                    key={tag.uuid}
                    value={JSON.stringify(tag)}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{tag.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex w-full flex-col gap-2 text-gray-500">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={!thisUserIsOwner} type="button">
              <button
                disabled={!thisUserIsOwner}
                aria-expanded={open}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-max min-h-9 w-full cursor-pointer items-center justify-start border-gray-300 bg-white/60 font-normal text-gray-500 hover:bg-white hover:text-gray-500',
                )}
                type="button"
              >
                <User />
                <span>Adicionar pessoas</span>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-full bg-white/60 p-0">
              <Command className="w-full bg-white/60 backdrop-blur-[2px]">
                <CommandInput
                  className="w-[calc(var(--container-3xs)-1.2rem)]"
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  <CommandGroup>
                    {!inputValue.includes('@') ? (
                      mails.map((mail) => (
                        <CommandItem
                          key={mail.value}
                          onSelect={() => {
                            append({ user: inputValue + mail.value });
                            setInputValue('');
                            setOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {inputValue + mail.value}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem
                        onSelect={() => {
                          append({ user: inputValue });
                          setOpen(false);
                          setInputValue('');
                        }}
                      >
                        {inputValue}
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex w-full flex-col">
            {fieldsFiltered.map((value, index) => {
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleRemoveAssign(index, value.user, event?.uuid)
                  }
                  disabled={!thisUserIsOwner}
                  type="button"
                  className="group flex w-full cursor-pointer items-center justify-between truncate rounded px-1 py-1 text-sm hover:bg-zinc-50/60"
                >
                  <span className="truncate">{value.user}</span>
                  <X
                    size={16}
                    strokeWidth={2}
                    className="invisible group-hover:visible"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <Popover>
          <PopoverTrigger
            className={cn(
              'flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1 text-gray-500',
              {
                'cursor-not-allowed opacity-60 **:cursor-not-allowed':
                  !thisUserIsOwner,
              },
            )}
            disabled={!thisUserIsOwner}
          >
            <CalendarIcon size={18} strokeWidth={1.5} />

            {watch('date')
              ? format(watch('date'), 'dd MMMM uuuu', {
                  locale: ptBR,
                }).replaceAll(' ', ' de ')
              : 'Selecionar data'}
          </PopoverTrigger>
          <PopoverContent className="w-max p-0" side="bottom">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Calendar
                  hasSelectMonth
                  className="border-none"
                  onSelect={(value) => {
                    field.onChange(value);
                  }}
                  selected={field.value}
                  disabled={(date) =>
                    date < setDate(new Date(), new Date().getDate() - 1)
                  }
                />
              )}
            />
          </PopoverContent>
        </Popover>
        <div className="flex w-full items-center justify-between">
          <span
            className={cn('text-gray-600', {
              'text-gray-400': !thisUserIsOwner,
            })}
          >
            Dia inteiro
          </span>

          <Controller
            control={control}
            name="allDay"
            render={({ field }) => (
              <Switch
                className="data-[state=checked]:bg-blue-500"
                disabled={!thisUserIsOwner}
                onCheckedChange={(value) => {
                  field.onChange(value);
                }}
                checked={field.value}
              />
            )}
          />
        </div>

        {watch('allDay') === false && (
          <>
            <div
              className={cn(
                'flex w-full items-center justify-between text-gray-600',
                {
                  'cursor-not-allowed opacity-60 **:cursor-not-allowed':
                    !thisUserIsOwner,
                },
              )}
            >
              <span>Começa</span>
              <div className="flex items-center justify-between gap-2 px-1.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 text-sm outline-none"
                    placeholder="00"
                    maxLength={2}
                    disabled={!thisUserIsOwner}
                    {...register('startTimeHours')}
                  />
                  <span>:</span>
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 text-sm outline-none"
                    maxLength={2}
                    disabled={!thisUserIsOwner}
                    {...register('startTimeMinutes')}
                  />
                </div>
                <AlarmClockCheck
                  color={colors.gray[500]}
                  strokeWidth={1.5}
                  size={20}
                />
              </div>
            </div>
            <div
              className={cn(
                'flex w-full items-center justify-between text-gray-600',
                {
                  'cursor-not-allowed opacity-60 **:cursor-not-allowed':
                    !thisUserIsOwner,
                },
              )}
            >
              <span>Termina</span>
              <div className="flex items-center justify-between gap-2 px-1.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 text-sm outline-none"
                    maxLength={2}
                    disabled={!thisUserIsOwner}
                    {...register('endTimeHours')}
                  />
                  <span>:</span>
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 text-sm outline-none"
                    maxLength={2}
                    disabled={!thisUserIsOwner}
                    {...register('endTimeMinutes')}
                  />
                </div>
                <AlarmClockCheck
                  color={colors.gray[500]}
                  strokeWidth={1.5}
                  size={20}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {thisUserIsOwner && (
        <div className="mt-10 flex w-full items-center justify-end gap-2">
          <Button className="h-8 rounded-lg px-2" variant="ghost">
            Cancelar
          </Button>
          <Button
            className="h-8 rounded-lg bg-emerald-500 px-2 hover:bg-emerald-600"
            type="submit"
          >
            Salvar
          </Button>
        </div>
      )}
    </form>
  );
};
