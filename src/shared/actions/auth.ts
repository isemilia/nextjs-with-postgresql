import * as z from "zod";
import { signUpSchema } from "@/shared/schemas/auth";
import { db } from "../lib/db";
import { hashPassword } from "../utils/password-hasher";

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);

    if (existingUser.rows.length > 0) {
        console.error('User with this email already exists')
    }

    const hashedPassword = await hashPassword(data.password, 'salt');

    console.log(hashedPassword)
}
