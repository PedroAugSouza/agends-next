import clsx from 'clsx';
import { Lilita_One } from 'next/font/google';

const lilita = Lilita_One({
  variable: '--font-lilitaone',
  subsets: ['latin'],
  weight: '400',
});

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Brand = ({ size = 'md' }: Props) => {
  return (
    <h1
      className={clsx(`${lilita.className} text-violet-600`, {
        'text-2xl': size === 'sm',
        'text-3xl': size === 'md',
        'text-4xl': size === 'lg',
        'text-5xl': size === 'xl',
      })}
    >
      Agends
    </h1>
  );
};
