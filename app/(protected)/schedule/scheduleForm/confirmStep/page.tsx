"use client"

import { CalendarBlank, Clock, CreditCard, Money, QrCode } from "phosphor-react";
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
import './confirmStep.css'
import { toast } from "sonner";
import { preferenceID } from "../../../../../actions/preference-id";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";

type ConfirmFormData = z.infer<typeof ConfirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
  barberID: string
  price: number
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation, barberID }: ConfirmStepProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConfirmFormData>({
    resolver: zodResolver(ConfirmFormSchema)
  })
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [preferenceStateID, setPreferenceStateID] = useState<string>()

  initMercadoPago('');

  const handleConfirmScheduling = async (values: ConfirmFormData) => {
    if (!values.email) {
      toast.error("O email tem que ser informado.")
      return
    }

    startTransition(() => {
      try {
        preferenceID("Degrade", 1, 30).then((data: any) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            setPreferenceStateID(data.success)
          }
        })
      } catch (error) {
        setError(`Something went wrong! Error:${error}`);
      }
    })

    const { phone, observations } = values

    const formattedDate = dayjs(schedulingDate).format("YYYY-MM-DDTHH:mm:ss[Z]");

    const props = {
      observations: observations ? observations : '',
      phone,
      date: formattedDate
    };

    /* startTransition(() => {
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
    }) */
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <div className="flex flex-col gap-4 space-y-4 mx-0">
      <div>
        <div className="flex items-center gap-4 border-b border-gray-600">
          <span className="flex items-center gap-2 mb-3">
            <CalendarBlank />
            <span>{describedDate}</span>
          </span>
          <span className="flex items-center gap-2 mb-3">
            <Clock />
            <span>{describedTime}</span>
          </span>
        </div>

        <form onSubmit={handleSubmit(handleConfirmScheduling)} className="flex flex-col space-y-4">

          <div className="flex flex-col space-y-2 mt-3">
            <span className="text-sm">Telefone</span>
            <Input type="tel" {...register('phone')} />
            {errors.phone && (
              <span className="text-sm text-red-500">{errors.phone.message}</span>
            )}
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            <span className="text-sm">Email</span>
            <Input type="email" {...register('email')} />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-sm">Observações</span>
            <Textarea {...register('observations')} />
          </div>

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <div className="flex flex-col space-y-2 mt-3">
            <div className="payment-methods">
              <p>Selecione o método de pagamento:</p>
              <div className="payment-buttons">
                <Button
                  type="button"
                  onClick={() => setPaymentMethod(paymentMethod === "card" ? "" : "card")}
                  className={`payment-button ${paymentMethod === "card" ? "selected" : ""}`}
                >
                  <CreditCard size={24} />
                  <span>Cartão de Crédito ou Débito</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setPaymentMethod(paymentMethod === "pix" ? "" : "pix")}
                  className={`payment-button ${paymentMethod === "pix" ? "selected" : ""}`}
                >
                  <QrCode size={24} />
                  <span>PIX</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setPaymentMethod(paymentMethod === "cash" ? "" : "cash")}
                  className={`payment-button ${paymentMethod === "cash" ? "selected" : ""}`}
                >
                  <Money size={24} />
                  <span>Dinheiro</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-start gap-2 mt-2">
              <Button type="submit" disabled={false}>Confirmar</Button>
              <Button type="button" variant="outline" onClick={onCancelConfirmation}>Cancelar</Button>
            </div>
          </div>
        </form>

        {
          preferenceStateID && (
            <Wallet initialization={{ preferenceId: preferenceStateID }} customization={{ texts: { valueProp: 'smart_option' } }} locale="pt-BR" />
          )
        }
      </div>
    </div >
  )
}
