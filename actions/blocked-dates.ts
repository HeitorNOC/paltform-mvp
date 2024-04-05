import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const blockedDates = async (year: number, month: number) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

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
            user_id: user.id,
        },
    })

    const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
        return !availableWeekDays.some(
            (availableWeekDay: any) => availableWeekDay.week_day === weekDay,
        )
    })

    const blockedDatesRaw: Array<{ date: number }> = await db.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.DATE) AS date,
      COUNT(S.date) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size
    FROM schedulings S
    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
    WHERE S.user_id = ${user.id}
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
    GROUP BY EXTRACT(DAY FROM S.DATE),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
    HAVING amount >= size
  `

    const blockedDates = blockedDatesRaw.map((item) => item.date)

    return { success: {blockedWeekDays, blockedDates} }
}