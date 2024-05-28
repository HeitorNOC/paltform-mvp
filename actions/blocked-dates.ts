"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const blockedDates = async (year: number, month: number, barberID: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(barberID);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!year || !month) {
    return { error: 'Year or month not specified.' }
  }

  const availableWeekDays = await db.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: dbUser.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay: any) => availableWeekDay.week_day === weekDay,
    )
  })

  const haveSomeScheule = await db.scheduling.findFirst({
    where: {
      user_id: dbUser.id
    }
  })

  let blockedDates: any[] = []

  if (haveSomeScheule) {
    const blockedDatesRaw: Array<{ date: number }> = await db.$queryRaw`
     SELECT
        STRFTIME('%d', S.date) AS date,
        COUNT(S.date) AS amount,
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size
    FROM schedulings S
    LEFT JOIN user_time_intervals UTI
        ON UTI.week_day = CAST((STRFTIME('%w', DATE(S.date, '+1 day'))) AS INTEGER)
    WHERE S.user_id = ${dbUser.id}
        AND STRFTIME('%Y', S.date) = ${year}
        AND STRFTIME('%m', S.date) = ${month}
    GROUP BY STRFTIME('%d', S.date), ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
    HAVING amount >= size
    `

    blockedDates = blockedDatesRaw.map((item) => item.date)
  }

  return { blockedWeekDays, blockedDates }
}