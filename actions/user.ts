"use server"

import { db } from "../lib/db";

export const listUsers = async (role?: string) => {
    let usersToResponse

    if (role) {
         usersToResponse = await db.user.findMany({
            where: { role }
        })
    } else {
        usersToResponse = await db.user.findMany()
    }

    return { users: usersToResponse }
}