"use server"

import MercadoPagoConfig, { Preference } from "mercadopago";
import { getUserById } from "../data/user";
import { currentUser } from "../lib/auth";
import { randomUUID } from "crypto";

export const preferenceID = async (title: string, quantity: number, price: number) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (!title || !quantity || !price) return { error: "Invalid Fields" };

    const client = new MercadoPagoConfig({ accessToken: '' }); 

    const id = randomUUID()

    try {
        const body = {
            items: [
                {
                    id,
                    title,
                    quantity,
                    unit_price: price,
                    currency_id: "BRL",
                }
            ],
            back_urls: {
                success: "https://youtube.com",
                failure: "https://youtube.com",
                pending: "https://youtube.com"
            },
            auto_return: "approved",
        }

        const preference = new Preference(client)
        const result = await preference.create({ body })

        if (result.id) return { success: result.id }
    } catch (error) {
        console.log(error)
        return { error }
    }
}