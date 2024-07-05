"use client"

import { preferenceID } from "@/actions/preference-id"
import Spinner from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import { startTransition, useEffect, useState } from "react"

export default function Payment({ params }: any) {
    const scheduleID = params.id

    initMercadoPago('');

    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [preferenceStateID, setPreferenceStateID] = useState<string>()

    useEffect(() => {
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
    }, [])

    return !preferenceStateID ? <Spinner /> : (

        <div>
            <div className="paymentOpitions">
                <div className="wallet">
                    <Wallet initialization={{ preferenceId: preferenceStateID }} customization={{ texts: { valueProp: 'payment_methods_logos' } }} locale="pt-BR" key={`${preferenceStateID}-${"Degrade"}-${30}`} />
                </div>
                <p>Ou</p>
                <Button className="payment-button">
                    Dinheiro
                </Button>
            </div>
        </div>

    )
}