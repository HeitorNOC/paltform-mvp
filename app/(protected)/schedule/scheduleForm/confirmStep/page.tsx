"use client"

import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { ConfirmFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { startTransition, useState } from "react";
import { schedule } from "@/actions/schedule";

type ConfirmFormData = z.infer<typeof ConfirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors }} = useForm<ConfirmFormData>({
    resolver: zodResolver(ConfirmFormSchema)
  })
  const [error, setError] = useState<string>("");

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(values: ConfirmFormData) {
    const { name, email, observations } = values

    const props = {
        name,
        email,
        observations: observations ? observations : '',
        date: String(schedulingDate)
    }

    startTransition(() => {
        try {
            schedule(props).then((data) => {
                if (data?.error) {
                    setError(data.error);
                    return
                }

                onCancelConfirmation()
            });
        } catch (err) {
            setError(`Something went wrong! Error:${err}`);
        } finally {
            setError("");
        }
    });

    await router.push(`/schedule/${username}`)
    onCancelConfirmation()
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-4">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-600">
        <span className="flex items-center gap-2">
          <CalendarBlank />
          <span>{describedDate}</span>
        </span>
        <span className="flex items-center gap-2">
          <Clock />
          <span>{describedTime}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit(handleConfirmScheduling)} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <span className="text-sm">Nome completo</span>
          <Input placeholder="Seu nome" {...register('name')}/>
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-sm">Endereço de e-mail</span>
          <Input type="email" placeholder="johndoe@example.com" {...register('email')}/>
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <span className="text-sm">Observações</span>
          <Textarea {...register('observations')}/>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="outline" onClick={onCancelConfirmation}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
        </div>
      </form>
    </div>
  )
}
