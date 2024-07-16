"use server"

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateSchedulingBody } from "@/schemas";
import dayjs from "dayjs";
import { google } from "googleapis"
import { getGoogleOAuthToken } from "@/lib/google"
import * as z from "zod";
import { OAuth2Client } from "google-auth-library";

export const schedule = async (values: z.infer<typeof CreateSchedulingBody>, barberID: string, haircutID: string) => {

    const user = await currentUser();
    const validatedFields = CreateSchedulingBody.parse(values);

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    const dbBarber = await getUserById(barberID)

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (!dbBarber) {
        return { error: "Barber not found" };
    }

    if (!validatedFields) {
        return { error: "Invalid fields." };
    }

    if (!dbBarber.name || !dbBarber.email) {
        return { error: "Invalid Barber Fields" }
    }

    if (!dbUser.name || !dbUser.email) {
        return { error: "Invalid User Fields" }
    }

    const { date, phone, observations } = validatedFields
    const utcDate = dayjs(date).subtract(dayjs(date).utcOffset(), 'minute');
    const schedulingDate = dayjs(utcDate).startOf('hour')

    if (schedulingDate.isBefore(new Date())) {
        return { error: "Date is in the past." }
    }

    const conflictingScheduling = await db.scheduling.findFirst({
        where: {
            user_id: user.id,
            date: schedulingDate.toDate()
        }
    })

    if (conflictingScheduling) {
        return { error: "There is another scheduling at the same time" }
    }

    const result = await db.scheduling.create({
        data: {
            name: dbBarber.name,
            email: dbBarber.email,
            observations,
            date: schedulingDate.toDate(),
            user_phone: phone,
            user_id: dbUser.id,
            payment_method: "money",
            payment_status: "approved",
        }
    })

    await db.scheduling.create({
        data: {
            name: dbUser.name,
            email: dbUser.email,
            observations,
            date: schedulingDate.toDate(),
            user_phone: phone,
            user_id: dbBarber.id,
            payment_method: "money",
            payment_status: "approved",
        }
    })

    const haveGoogleAccount = dbUser.accounts.some(account => account.provider === "google");
   
    if (haveGoogleAccount) {
        try {
            const auth = await getGoogleOAuthToken(user.id);
            const calendar = google.calendar({ version: 'v3', auth });

            await calendar.events.list({
                calendarId: 'primary',
                maxResults: 1
            });

            await calendar.events.insert({
                calendarId: 'primary',
                conferenceDataVersion: 1,
                requestBody: {
                    summary: `Agendamento para ${user.name}`,
                    description: observations,
                    start: {
                        dateTime: schedulingDate.format(),
                        timeZone: 'America/Sao_Paulo'
                    },
                    end: {
                        dateTime: schedulingDate.add(1, 'hour').format(),
                        timeZone: 'America/Sao_Paulo'
                    },
                    attendees: [{ email: dbBarber.email, displayName: dbBarber.name }]
                }
            });
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const gError = error as { code: number; message: string };
                if (gError.code === 403) {
                    console.log('Permissões insuficientes para adicionar ao Google Calendar. Continuando sem adicionar.');
                } else {
                    console.error('Erro ao acessar o Google Calendar:', gError.message);
                }
            } else {
                console.error('Erro desconhecido:', error);
            }
        }
    }    

    return { success: result.id }
}