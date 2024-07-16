"use server";

import { ROLES } from "@/app/(protected)/_constants";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const barberHaircuts = async (barberID: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbBarber = await getUserById(barberID);
 
  if (!dbBarber) {
    return { error: "Barber not found" };
  }

  const barberWithHaircuts = await db.user.findUnique({
    where: { id: dbBarber.id, role: ROLES.BARBER },
    include: { UserRepository: true }
  })
 
  if (barberWithHaircuts?.UserRepository) return { haircuts: barberWithHaircuts.UserRepository }
}