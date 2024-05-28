"use server"

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateSchedulingBody } from "@/schemas";
import dayjs from "dayjs";
import { google } from "googleapis"
import { getGoogleOAuthToken } from "@/lib/google"
import * as z from "zod";

export const schedule = async (values: z.infer<typeof CreateSchedulingBody>, barberID: string) => {

    const user = await currentUser();
    const validatedFields = CreateSchedulingBody.parse(values);

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }


    if (!validatedFields) {
        return { error: "Invalid fields." };
    }

    const { date, email, name, observations } = validatedFields

    const schedulingDate = dayjs(date).startOf('hour')

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

    const scheduling = await db.scheduling.create({
        data: {
            name,
            email,
            observations,
            date: schedulingDate.toDate(),
            user_id: user.id
        }
    })

    const calendar = google.calendar({
        version: 'v3',
        auth: await getGoogleOAuthToken(user.id)
    })

    await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
            summary: `Platform MVP: ${name}`,
            description: observations,
            start: {
                dateTime: schedulingDate.format()
            },
            end: {
                dateTime: schedulingDate.add(1, 'hour').format()
            },
            attendees: [
                { email, displayName: name }
            ],
            conferenceData: {
                createRequest: {
                    requestId: scheduling.id,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            },
        }
    })

    return { success: "Schedule Created!" }
}