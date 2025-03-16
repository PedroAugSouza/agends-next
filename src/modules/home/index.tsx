'use client';

import { Brand } from '@/shared/components/common/brand';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { ChevronDown, Inbox, Plus } from 'lucide-react';
import colors from 'tailwindcss/colors';

export const HomeModule = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <nav className="flex h-13 w-screen items-center justify-between border-b border-zinc-200 bg-gray-100 px-6">
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
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="group w-full items-center justify-between [&>svg]:hidden">
                <h1 className="text-base font-semibold text-gray-700">
                  Minha agenda
                </h1>
                <div className="flex items-center gap-1 text-gray-500">
                  <Plus size={22} />
                  <ChevronDown
                    size={22}
                    className="transition-all group-data-[state=open]:rotate-180"
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="group w-full items-center justify-between [&>svg]:hidden">
                <h1 className="text-base font-semibold text-gray-700">
                  Minha agenda
                </h1>
                <div className="flex items-center gap-1 text-gray-500">
                  <Plus size={22} />
                  <ChevronDown
                    size={22}
                    className="transition-all group-data-[state=open]:rotate-180"
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-1"></div>
      </div>
    </main>
  );
};
