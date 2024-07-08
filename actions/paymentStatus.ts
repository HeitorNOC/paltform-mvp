import MercadoPagoConfig, { Payment } from "mercadopago";
import { db } from "@/lib/db";


export const updatePaymentStatus = async (paymentId: string) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7122545813750945-062514-142887b94954d8b975a4cef2020f1a82-1841094915' });

        const paymentClient = new Payment(client)

        const payment = await paymentClient.get({ id: paymentId })

        const { status, external_reference } = payment

        if (status === "approved" || status === "pending") {
            await db.scheduling.update({
                where: { id: external_reference },
                data: { payment_status: status },
            })
        } else {
            console.log('else: ', status)
            await db.scheduling.delete({
                where: {
                    id: external_reference
                }
            })
        }
    } catch (error) {

    }

}
