"use client"

import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getWeekDays } from "@/utils/get-week-days";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { timeIntervals as timeIntervalsFn } from '@/actions/time-intervals'
import { TimeIntervalsPageSchema } from "@/schemas";
import { toast } from "sonner";
import './styles.css'

type TimeIntervalsFormInput = z.input<typeof TimeIntervalsPageSchema>;
type TimeIntervalsFormOutput = z.output<typeof TimeIntervalsPageSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(TimeIntervalsPageSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "10:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "10:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "10:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "10:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "10:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "10:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "10:00" },
      ],
    },
  });

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const intervals = watch("intervals");

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput;
    const res = await timeIntervalsFn({ intervals });

    if (res.success) toast.success(res.success)
      else toast.error(res.error)
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <span>Quase lá</span>
        <p>Defina o intervalo de horário que você está disponível em cada dia da semana.</p>
      </div>

      <form onSubmit={handleSubmit(handleSetTimeIntervals)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Controller
                name={`intervals.${index}.enabled`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <p>{weekDays[field.weekDay]}</p>
            </div>
            <div className="flex space-x-2">
              <Input
                type="time"
                step={60}
                disabled={intervals[index].enabled === false}
                {...register(`intervals.${index}.startTime`)}
                className=".timeInputIcon"
              />
              <Input
                type="time"
                step={60}
                disabled={intervals[index].enabled === false}
                {...register(`intervals.${index}.endTime`)}
                className=".timeInputIcon"
              />
            </div>
          </div>
        ))}
        {errors.intervals && (
          <FormError message={errors.intervals.message} />
        )}
        <div>
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
