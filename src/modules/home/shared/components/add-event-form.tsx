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
  useGetAllTagsControllerHandle,
} from '@/shared/http/http';
import { getSession } from '@/shared/utils/get-session';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
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

type FormType = z.infer<typeof addEventSchema>;

interface TagType {
  uuid: string;
  name: string;
  color: string;
}

export const AddEventForm = () => {
  const { register, control, handleSubmit, setValue, watch } =
    useForm<FormType>({
      resolver: zodResolver(addEventSchema),
      defaultValues: {
        allDay: false,
      },
    });

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'asssignedUsers',
  });

  const user = getSession();

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

  const { data: tags } = useGetAllTagsControllerHandle(user?.uuid ?? '', {
    axios: {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    },
  });

  const tagSelected: TagType = watch('tagUuid')
    ? JSON.parse(watch('tagUuid'))
    : {};

  const handleCreateEvent = async (data: FormType) => {
    if (data.allDay === false) {
      const startHours = setHours(data.date, Number(data.startTimeHours));
      const endHours = setHours(data.date, Number(data.endTimeHours));

      const startsTime = setMinutes(startHours, Number(data.startTimeMinutes));
      const endsTime = setMinutes(endHours, Number(data.endTimeMinutes));

      await createEventControllerHandle(
        {
          name: data.name,
          date: data.date,
          allDay: data.allDay,
          startsOf: startsTime,
          endsOf: endsTime,
          tagUuid: tagSelected.uuid,
          userUuid: user?.uuid,
          assignedUsers: data.asssignedUsers?.map((user) => user.user),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      return;
    }

    await createEventControllerHandle(
      {
        name: data.name,
        date: data.date,
        allDay: data.allDay,
        tagUuid: tagSelected.uuid,
        userUuid: user?.uuid,
        endsOf: null,
        startsOf: null,
        assignedUsers: data.asssignedUsers?.map((user) => user.user),
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      },
    );
  };

  return (
    <form
      className="flex h-80 w-full flex-col items-start justify-between gap-2.5"
      onSubmit={handleSubmit(handleCreateEvent)}
    >
      <div className="flex w-full flex-col items-start gap-2.5">
        <div className="flex w-full items-center gap-2.5">
          <div
            className="size-4 rounded-full border"
            style={{ background: tagSelected.color }}
          />
          <input
            type="text"
            className="border-none outline-none placeholder:italic"
            placeholder="Nome do evento"
            {...register('name')}
          />
        </div>

        <Controller
          control={control}
          name="tagUuid"
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger
                icon={<ChevronsUpDown />}
                className="w-full cursor-pointer border-gray-300"
              >
                <SelectValue placeholder="Selecione uma etiqueta" />
              </SelectTrigger>

              <SelectContent className="flex flex-col items-center gap-2">
                {tags?.data?.map((tag) => (
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
            {fields.length ? (
              <div
                aria-expanded={open}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'relative h-max min-h-9 w-full cursor-pointer justify-between border-gray-300 font-normal text-gray-500 hover:bg-white hover:text-gray-500',
                )}
              >
                <PopoverTrigger className="pointer-events-none absolute inset-0 h-full w-full" />
                <div className="flex flex-1 items-center gap-1">
                  <User />
                  <div className="flex flex-1 flex-wrap items-center gap-1 text-sm">
                    {fields.map((value, index) => (
                      <button
                        key={value.id}
                        onClick={() => {
                          remove(index);
                        }}
                        className="flex max-w-28 cursor-pointer items-center truncate rounded bg-gray-100 px-1"
                      >
                        <span className="truncate">{value.user}</span>
                        <X size={6} strokeWidth={1} />
                      </button>
                    ))}
                    <button
                      className="cursor-pointer rounded p-0.5 hover:bg-gray-100"
                      onClick={() => setOpen(true)}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <PopoverTrigger asChild>
                <div
                  aria-expanded={open}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-max min-h-9 w-full cursor-pointer items-center justify-start border-gray-300 font-normal text-gray-500 hover:bg-white hover:text-gray-500',
                  )}
                >
                  <User />
                  <span>Adicionar pessoas</span>
                </div>
              </PopoverTrigger>
            )}

            <PopoverContent className="w-full p-0">
              <Command className="w-full">
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
        </div>

        <Popover>
          <PopoverTrigger className="flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1 text-gray-500">
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
          <span className="text-gray-600">Dia inteiro</span>

          <Controller
            control={control}
            name="allDay"
            render={({ field }) => (
              <Switch
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
            <div className="flex w-full items-center justify-between text-gray-600">
              <span>Começa</span>
              <div className="flex items-center justify-between gap-2 px-1.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 outline-none"
                    placeholder="00"
                    maxLength={2}
                    {...register('startTimeHours')}
                  />
                  <span>:</span>
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 outline-none"
                    maxLength={2}
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
            <div className="flex w-full items-center justify-between text-gray-600">
              <span>Termina</span>
              <div className="flex items-center justify-between gap-2 px-1.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 outline-none"
                    maxLength={2}
                    {...register('endTimeHours')}
                  />
                  <span>:</span>
                  <input
                    type="text"
                    placeholder="00"
                    className="size-7 rounded border border-gray-200 bg-gray-50 px-1 outline-none"
                    maxLength={2}
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

      <div className="mt-10 flex w-full items-center justify-end gap-2.5">
        <Button className="bg-red-500 px-2 py-1">Cancelar</Button>
        <Button className="bg-emerald-500 px-2 py-1" type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
};
