'use client';
import { AlarmClockCheck, Calendar as CalendarIcon } from 'lucide-react';
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

import { format, set, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import {
  createEventControllerHandle,
  useGetAllTagsControllerHandle,
} from '@/shared/http/http';
import { getSession } from '@/shared/utils/get-session';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { addEventSchema } from '@/shared/schemas/add-event.schema';
import { zodResolver } from '@hookform/resolvers/zod';

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

  const user = getSession();

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
                  disabled={(date) => date < new Date()}
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
