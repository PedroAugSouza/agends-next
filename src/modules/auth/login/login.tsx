'use client';
import { Lilita_One } from 'next/font/google';
import { TextField } from '../components/text-field';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

const lilita = Lilita_One({
  variable: '--font-lilitaone',
  subsets: ['latin'],
  weight: '400',
});

export const LoginModule = () => {
  return (
    <main className="grid h-screen place-items-center">
      <form className="relative flex w-80 flex-col items-center justify-start gap-2.5">
        <div className="absolute right-28 -z-10 size-64 opacity-25 blur-lg">
          <div className="absolute size-52 rounded-full bg-sky-300" />
          <div className="absolute top-10 left-36 size-52 rounded-full bg-blue-300" />
          <div className="absolute top-36 size-52 rounded-full bg-violet-300" />
        </div>
        <h1 className="text-lg">
          Se planeje melhor com{' '}
          <span className={`${lilita.className} text-2xl text-violet-600`}>
            Agends
          </span>
        </h1>
        <TextField placeholder="Insira seu email." label="Email" />
        <TextField
          placeholder="Insira sua senha."
          label="Senha"
          type="password"
        />
        <Button
          className="h-11 w-full cursor-pointer bg-violet-700 text-lg hover:bg-violet-500"
          variant={'default'}
        >
          Entrar
        </Button>
        <div className="h-[1px] w-full bg-violet-300" />
        <span>
          Ainda não possui cadastro?{' '}
          <Link
            href="/register"
            className="font-semibold text-violet-700 hover:underline"
          >
            Cadastre-se
          </Link>
        </span>
      </form>
    </main>
  );
};
