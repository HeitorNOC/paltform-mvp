"use server"

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TimeIntervalsSchema } from "@/schemas";
import * as z from "zod";

export const timeIntervals = async (values: z.infer<typeof TimeIntervalsSchema>) => {
    const user = await currentUser();
    const validatedFields = TimeIntervalsSchema.safeParse(values);

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }

    const { intervals } = validatedFields.data;
    
    await db.userTimeInterval.deleteMany({
        where: { user_id: dbUser.id }
    })

    await Promise.all(intervals.map(interval => {
        return db.userTimeInterval.create({
            data: {
                week_day: interval.weekDay,
                time_start_in_minutes: interval.startTimeInMinutes,
                time_end_in_minutes: interval.endTimeInMinutes,
                user_id: dbUser.id
            }
        })
    }))

    return { success: "Intervals Created!" };
}