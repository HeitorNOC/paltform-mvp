"use client"

import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ConfirmFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { startTransition, useState } from "react";
import { schedule as scheduleFn } from "@/actions/schedule";
import { Toaster } from "@/components/ui/sonner";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import * as z from 'zod'

type ConfirmFormData = z.infer<typeof ConfirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
  barberID: string
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation, barberID }: ConfirmStepProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConfirmFormData>({
    resolver: zodResolver(ConfirmFormSchema)
  })
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const router = useRouter()

  const handleConfirmScheduling = (values: ConfirmFormData) => {
    const { phone, observations } = values

    const formattedDate = dayjs(schedulingDate).format("YYYY-MM-DDTHH:mm:ss[Z]");

    const props = {
      observations: observations ? observations : '',
      phone,
      date: formattedDate
    };

    startTransition(() => {
      try {
        const decodedURI = decodeURIComponent(barberID)
        const decodedID = atob(decodedURI)
        scheduleFn(props, decodedID).then((data: any) => {
          if (data?.error) {
            setError(data.error)
          } else if (data.success) {
            setSuccess(data.success)
            router.push('/')
          }
        })
      } catch (err) {
        setError(`Something went wrong! Error:${err}`);
      }
    })
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
          <span className="text-sm">Telefone</span>
          <Input type="tel" {...register('phone')} />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-sm">Observações</span>
          <Textarea {...register('observations')} />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="outline" onClick={onCancelConfirmation}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
        </div>
      </form>
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
    </div>
  )
}
