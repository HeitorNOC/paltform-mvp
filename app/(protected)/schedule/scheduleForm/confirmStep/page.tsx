"use client"

import { CalendarBlank, Clock, CreditCard, Money, Info } from "phosphor-react";
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
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as z from 'zod';
import './confirmStep.css';
import { toast } from "sonner";

type ConfirmFormData = z.infer<typeof ConfirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
  barberID: string
  itemID: number
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation, barberID }: ConfirmStepProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConfirmFormData>({
    resolver: zodResolver(ConfirmFormSchema)
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const router = useRouter();

  const handleConfirmScheduling = async (values: ConfirmFormData) => {
    if (!values.email) {
      toast.error("O email tem que ser informado.");
      return;
    }
    console.log('entrei')
    if (!paymentMethod) {
      toast.error("Selecione uma forma de pagamento")
      return
    }

    const { phone, observations } = values;
    const formattedDate = dayjs(schedulingDate).format("YYYY-MM-DDTHH:mm:ss[Z]");

    const props = {
      observations: observations ? observations : '',
      phone,
      date: formattedDate,
      email: values.email,
      payment_method: paymentMethod
    };

    startTransition(() => {
      try {
        const decodedURI = decodeURIComponent(barberID);
        const decodedID = atob(decodedURI);
        scheduleFn(props, decodedID).then((data: any) => {
          if (data?.error) {
            setError(data.error);
          } else if (data.success) {
            router.push('/schedule/calendar/payment/' + data.success);
          }
        });
      } catch (err) {
        setError(`Algo deu errado! Erro: ${err}`);
      }
    });
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethod(prev => prev === method ? '' : method);
  };

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY');
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]');

  return (
    <div className="confirm-step-container">
      <div className="date-time gap-2">
        <div className="date-time-item">
          <CalendarBlank />
          <span>{describedDate}</span>
        </div>
        <div className="date-time-item">
          <Clock />
          <span>{describedTime}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleConfirmScheduling)} className="form">
        <div className="input-group">
          <span className="text-sm">Telefone</span>
          <Input type="tel" {...register('phone')} />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone.message}</span>
          )}
        </div>
        <div className="input-group">
          <span className="text-sm">Email</span>
          <Input type="email" {...register('email')} />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="input-group">
          <span className="text-sm">Observações</span>
          <Textarea className="resize-none" {...register('observations')} />
        </div>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <div className="payment-methods">
          <span className="text-sm">Selecione a forma de pagamento:</span>
          <div className="payment-cards">
            <Card
              className={`payment-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => togglePaymentMethod('cash')}
            >
              <div className="flex items-center gap-2">
                <Money />
                <span>Dinheiro</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="info-icon-container">
                        <Info className={`info-icon ${paymentMethod === 'cash' ? 'selected-icon' : ''}`} size={24} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="tooltip-content" side="right">
                      <span>Pague em dinheiro no local.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </div>
            </Card>
            <Card
              className={`payment-card ${paymentMethod === 'online' ? 'selected' : ''}`}
              onClick={() => togglePaymentMethod('online')}
            >
              <div className="flex items-center gap-2">
                <CreditCard />
                <span>Online</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="info-icon-container">
                        <Info className={`info-icon ${paymentMethod === 'online' ? 'selected-icon' : ''}`} size={24} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="tooltip-content" side="right">
                      <span>Pague online via Mercado Pago. <br />Pix, Cartão de crédito e débito e pagamento via mercado pago.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          </div>
        </div>
        <div className="actions">
          <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
          <Button type="button" variant="outline" onClick={onCancelConfirmation}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
