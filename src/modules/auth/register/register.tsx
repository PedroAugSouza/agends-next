'use client';

import { Button } from '@/shared/components/ui/button';
import { Lilita_One } from 'next/font/google';
import Link from 'next/link';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { TextField } from '../components/text-field';
import colors from 'tailwindcss/colors';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';

const lilita = Lilita_One({
  variable: '--font-lilitaone',
  subsets: ['latin'],
  weight: '400',
});
export const RegisterModule = () => {
  return (
    <main className="grid h-screen place-items-center">
      <form className="relative flex w-83 flex-col items-center justify-start gap-2.5">
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
        <TextField placeholder="Insira seu nome." label="Nome" />
        <TextField placeholder="Insira seu email." label="Email" />
        <TextField placeholder="Insira sua senha." label="Senha" />
        <div className="flex w-full flex-col items-center gap-2.5 text-sm">
          <div className="flex w-full items-center justify-start gap-2.5 text-gray-700">
            <div className="grid size-5 place-items-center rounded bg-emerald-500">
              <Check color={colors.white} size={18} />
            </div>

            <span>Deve conter letras e números.</span>
          </div>
          <div className="flex w-full items-center justify-start gap-2.5 text-gray-700">
            <div className="grid size-5 place-items-center rounded bg-emerald-500">
              <Check color={colors.white} size={18} />
            </div>

            <span>Deve conter mais de oito caracteres.</span>
          </div>
          <div className="flex w-full items-center justify-start gap-2.5 text-gray-700">
            <div className="grid size-5 place-items-center rounded bg-emerald-500">
              <Check color={colors.white} size={18} />
            </div>

            <span>Deve conter caracteres especiais: _, @, #, etc.</span>
          </div>
        </div>
        <TextField
          placeholder="Confirme sua senha.."
          label="Confirme sua senha"
        />

        <TextField
          label="Data de Nascimento"
          customInput={
            <div className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-slate-400 bg-gray-50 px-1.5 py-1.5 shadow-md transition-all outline-none focus:border-slate-600">
              <div className="grid w-19 place-items-center">07</div>
              <div className="h-full w-[1px] bg-gray-600" />
              <div className="grid w-19 place-items-center">Fevereiro</div>
              <div className="h-full w-[1px] bg-gray-600" />
              <div className="grid w-19 place-items-center">2025</div>
              <Popover>
                <PopoverTrigger className="grid h-full w-15 cursor-pointer place-items-center rounded bg-gray-200">
                  <CalendarIcon
                    color={colors.gray[700]}
                    size={16}
                    strokeWidth={1.5}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    className="rounded-lg"
                    mode="single"
                    onSelect={(value) => console.log(value)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          }
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
