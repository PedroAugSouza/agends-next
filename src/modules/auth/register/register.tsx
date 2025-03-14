'use client';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/shared/components/ui/button';
import { Lilita_One } from 'next/font/google';
import Link from 'next/link';
import { Calendar as CalendarIcon, Check, X } from 'lucide-react';
import { TextField } from '../components/text-field';
import colors from 'tailwindcss/colors';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUserSchema } from '@/shared/schemas/register-user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMonth } from '@/shared/utils/getMonth';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { getYear, setMonth, setYear, getMonth as getMonthFNS } from 'date-fns';
import React from 'react';
import { PopoverArrow } from '@radix-ui/react-popover';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import clsx from 'clsx';

const lilita = Lilita_One({
  variable: '--font-lilitaone',
  subsets: ['latin'],
  weight: '400',
});

type FormProps = z.infer<typeof registerUserSchema>;

export const RegisterModule = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  const { signUp, serverErrors } = useAuth();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormProps>({
    resolver: zodResolver(registerUserSchema),
  });

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

  const currentDate = watch('dateBirth') ? watch('dateBirth') : new Date();

  const years = Array.from(
    { length: 2025 - startsYear + 1 },
    (_, i) => startsYear + i,
  ).reverse();

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(currentDate, months.indexOf(month));
    setValue('dateBirth', newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(currentDate, Number(year));
    setValue('dateBirth', newDate);
  };

  const onSubmit: SubmitHandler<FormProps> = (data) => {
    signUp(data);
  };

  return (
    <main
      className={clsx('', {
        'grid h-screen place-items-center': !isSmallDevice,
        'item-center flex justify-center pt-12': isSmallDevice,
      })}
    >
      <form
        className="relative flex w-83 flex-col items-center justify-start gap-2.5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="absolute right-28 -z-10 size-64 opacity-25 blur-lg">
          <div className="absolute size-52 rounded-full bg-sky-300" />
          <div className="absolute top-10 left-36 size-52 rounded-full bg-blue-300" />
          <div className="absolute top-36 size-52 rounded-full bg-violet-300" />
        </div>
        <h1 className="text-lg">
          Se planeje melhor com o{'  '}
          <span className={`${lilita.className} text-2xl text-violet-600`}>
            Agends
          </span>
        </h1>
        <TextField
          placeholder="Insira seu nome."
          label="Nome"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          placeholder="Insira seu email."
          label="Email"
          error={errors.email?.message || serverErrors?.email}
          {...register('email')}
        />
        <TextField
          placeholder="Insira sua senha."
          label="Senha"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <TextField
          placeholder="Confirme sua senha.."
          label="Confirme sua senha"
          type="password"
          {...register('passwordConfirmation')}
          error={errors.passwordConfirmation?.message}
        />

        <TextField
          label="Data de Nascimento"
          customInput={
            <div className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-slate-400 bg-gray-50 px-1.5 py-1.5 shadow-md transition-all outline-none focus:border-slate-600">
              <div className="grid w-19 place-items-center">
                {watch('dateBirth')?.getDate()
                  ? watch('dateBirth').getDate()
                  : 'DD'}
              </div>
              <div className="h-full w-[1px] bg-gray-600" />
              <div className="grid w-19 place-items-center">
                {watch('dateBirth')?.getMonth()
                  ? getMonth(watch('dateBirth')?.getMonth())
                  : 'MM'}
              </div>
              <div className="h-full w-[1px] bg-gray-600" />
              <div className="grid w-19 place-items-center">
                {' '}
                {watch('dateBirth')?.getFullYear()
                  ? watch('dateBirth')?.getFullYear()
                  : 'YYYY'}
              </div>

              {isSmallDevice ? (
                <Drawer
                  shouldScaleBackground={true}
                  setBackgroundColorOnScale={false}
                >
                  <DrawerTrigger
                    className="grid h-full w-15 cursor-pointer place-items-center rounded bg-gray-100"
                    type="button"
                  >
                    <CalendarIcon
                      color={colors.gray[700]}
                      size={16}
                      strokeWidth={1.5}
                    />
                  </DrawerTrigger>
                  <DrawerContent className="flex flex-col items-center justify-center pb-2.5">
                    <DrawerTitle className="text-gray-700">
                      Selecione a data de nascimento
                    </DrawerTitle>
                    <div className="flex w-full items-center justify-center gap-2.5 px-4 pt-3">
                      <Select
                        onValueChange={handleMonthChange}
                        value={getMonth(getMonthFNS(currentDate))}
                      >
                        <SelectTrigger className="h-10 w-40 cursor-pointer">
                          <SelectValue
                            className="text-gray-700"
                            placeholder={getMonth(getMonthFNS(currentDate))}
                          />
                        </SelectTrigger>
                        <SelectContent className="h-64 overflow-y-auto">
                          {months.map((month) => (
                            <SelectItem
                              key={month}
                              value={month.toString()}
                              className="h-10 cursor-pointer"
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
                        <SelectTrigger className="h-10 w-40 cursor-pointer">
                          <SelectValue
                            className="text-gray-700"
                            placeholder={getYear(currentDate).toString()}
                          />
                        </SelectTrigger>
                        <SelectContent className="h-64 overflow-y-auto">
                          {years.map((year) => (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="h-10 cursor-pointer"
                            >
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Controller
                      control={control}
                      name="dateBirth"
                      render={({ field }) => (
                        <Calendar
                          locale={ptBR}
                          className="w-max rounded-lg"
                          mode="single"
                          selected={field.value}
                          classNames={{
                            day_selected:
                              'bg-violet-600 text-white hover:bg-violet-500 hover:text-white',
                            cell: 'size-10',
                            head_cell: 'w-10 font-normal',
                            nav_button: 'disable opacity-0 pointer-events-none',
                          }}
                          month={field.value}
                          onSelect={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </DrawerContent>
                </Drawer>
              ) : (
                <Popover>
                  <PopoverTrigger className="grid h-full w-15 cursor-pointer place-items-center rounded bg-gray-100">
                    <CalendarIcon
                      color={colors.gray[700]}
                      size={16}
                      strokeWidth={1.5}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-max p-0">
                    <PopoverArrow className="fill-gray-300" />
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
                    <Controller
                      control={control}
                      name="dateBirth"
                      render={({ field }) => (
                        <Calendar
                          locale={ptBR}
                          className="w-max rounded-lg"
                          mode="single"
                          selected={field.value}
                          classNames={{
                            day_selected:
                              'bg-violet-600 text-white hover:bg-violet-500 hover:text-white',
                          }}
                          month={field.value}
                          onSelect={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          }
          error={errors.dateBirth?.message || serverErrors?.dateBirth}
        />

        <Button
          className="h-11 w-full cursor-pointer bg-violet-700 text-lg hover:bg-violet-500"
          variant={'default'}
        >
          Registrar
        </Button>
        <div className="h-[1px] w-full bg-violet-300" />
        <span>
          Já possui cadastro?{' '}
          <Link
            href="/login"
            className="font-semibold text-violet-700 hover:underline"
          >
            Entre
          </Link>
        </span>
      </form>
    </main>
  );
};
