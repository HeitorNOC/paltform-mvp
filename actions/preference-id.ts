"use server"

import MercadoPagoConfig, { Preference } from "mercadopago";
import { getUserById } from "../data/user";
import { currentUser } from "../lib/auth";
import { randomUUID } from "crypto";

export const preferenceID = async (title: string, quantity: number, price: number, scheduleID: string) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (!title || !quantity || !price) return { error: "Invalid Fields" };

    try {
        const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8586528159614953-070615-55a003c99bd554f0c27fba2b24c6e083-1874323624' });

        const body = {
            items: [
                {
                    id: scheduleID,
                    title,
                    quantity,
                    unit_price: price,
                    currency_id: "BRL",
                }
            ],
            back_urls: {
                success: "http://localhost:3000/schedule/calendar/payment/success",
                failure: "http://localhost:3000/schedule/calendar/payment/failure",
                pending: "http://localhost:3000/schedule/calendar/payment/pending"
            },

            auto_return: "approved",
            notification_url: "http://localhost:3000/api/webhook",
            external_reference: scheduleID
        }

        const preference = new Preference(client)
        const result = await preference.create({ body })
        if (result.id) return { success: result.id }
    } catch (error) {
        console.log(error)
        return { error }
    }
}