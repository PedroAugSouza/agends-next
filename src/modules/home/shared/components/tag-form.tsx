'use client';

import { createTagsControllerHandle } from '@/shared/http/http';
import { addTagSchema } from '@/shared/schemas/add-tag.schcema';
import { getSession } from '@/shared/utils/get-session';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group';
import { ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';

type FormTagType = z.infer<typeof addTagSchema>;

interface Props {
  setToggleAddTag: Dispatch<SetStateAction<boolean>>;
  mutateTags: () => void;
}

export const TagForm = ({ mutateTags, setToggleAddTag }: Props) => {
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
  const user = getSession();

  const { register, control, handleSubmit, watch } = useForm<FormTagType>({
    resolver: zodResolver(addTagSchema),
    defaultValues: {
      color: '#7C3AED',
    },
  });
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
      mutateTags();
    });
  };
  return (
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
  );
};
