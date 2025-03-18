'use client';

import { Brand } from '@/shared/components/common/brand';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group';
import {
  createTagsControllerHandle,
  removeTagsControllerHandle,
  useGetAllTagsControllerHandle,
  useRemoveTagsControllerHandle,
} from '@/shared/http/http';
import { addTagSchema } from '@/shared/schemas/add-tag.schcema';
import { getSession } from '@/shared/utils/get-session';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccordionHeader } from '@radix-ui/react-accordion';
import {
  ChevronDown,
  ChevronRight,
  CircleEllipsis,
  Inbox,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import colors from 'tailwindcss/colors';
import { z } from 'zod';

type FormTagType = z.infer<typeof addTagSchema>;

export const HomeModule = () => {
  const user = getSession();

  const { register, control, handleSubmit, watch } = useForm<FormTagType>({
    resolver: zodResolver(addTagSchema),
    defaultValues: {
      color: '#7C3AED',
    },
  });

  const colorsTag = [
    '#6B7280',
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#84CC16',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
    '#7C3AED',
  ];

  const [toggleAddTag, setToggleAddTag] = useState(false);

  const { data, mutate } = useGetAllTagsControllerHandle(user.uuid);

  const onSubmit: SubmitHandler<FormTagType> = (data) => {
    createTagsControllerHandle(
      {
        name: data.name,
        color: data.color,
        userUuid: user.uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    ).then(() => {
      setToggleAddTag(false);
      mutate();
    });
  };

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
              <AccordionContent>
                {data?.data.map((tag) => (
                  <Popover key={tag.uuid}>
                    <PopoverTrigger className="group flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white">
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
                        className="hidden group-hover:flex"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      className="flex w-fit flex-col items-start justify-start gap-2.5 p-1"
                    >
                      <Button
                        size="sm"
                        className="cursor-pointer rounded bg-gray-50 text-zinc-700 hover:bg-gray-100"
                        onClick={() =>
                          removeTagsControllerHandle(tag.uuid, {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          }).then(() => {
                            mutate();
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
              <form
                className="mt-2.5 flex w-full flex-col items-start justify-start gap-2.5 rounded-md border border-gray-200 bg-white px-1 py-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex w-full items-center justify-between gap-2.5 border-b border-gray-300 px-2.5 pt-0 pb-1">
                  <input
                    type="text"
                    className="border-none bg-none outline-none"
                    placeholder="Nome..."
                    {...register('name')}
                  />
                  <button
                    className="grid size-5 cursor-pointer place-items-center rounded-sm text-white"
                    type="submit"
                    style={{
                      backgroundColor: watch('color'),
                    }}
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <Controller
                  control={control}
                  name="color"
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      defaultValue={field.value}
                      className="flex w-full items-center justify-center gap-2.5 px-2"
                    >
                      {colorsTag.map((color, index) => (
                        <ToggleGroupItem
                          value={color}
                          key={index}
                          type="button"
                          className="size-[18px] rounded-full border border-gray-200 transition-all hover:border-gray-400"
                          size="sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </ToggleGroup>
                  )}
                />
              </form>
            )}
            <AccordionItem value="item-2">
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
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-1"></div>
      </div>
    </main>
  );
};
