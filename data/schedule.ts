import { db } from "@/lib/db";

export const getScheduleByID = async (scheduleID: string) => {
  try {
    const schedule = await db.scheduling.findFirst({
      where: { id: scheduleID },
    });

    return schedule;
  } catch {
    return null;
  }
};