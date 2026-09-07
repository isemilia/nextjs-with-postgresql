import { db } from "@/shared/lib/db";
import { signUpSchema } from "@/shared/schemas/auth";
import { User, userSchema } from "@/shared/schemas/user";
import { generateSalt, hashPassword } from "@/shared/utils/password-hasher";
import { createUserSession } from "@/shared/utils/session";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export const POST = async (request: NextRequest) => {
    const data = await request.json() as z.infer<typeof signUpSchema>;

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);

    if (existingUser.rows.length > 0) {
        return NextResponse.json(
            { status: 'error', message: 'User with this email already exists' },
            { status: 400 }
        );
    }

    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(data.password, salt);

        const res = await db.query(`
            INSERT INTO users (name, email, password, salt)
            VALUES ($1, $2, $3, $4)
            RETURNING name, email, id, role 
        `,
            [data.name, data.email, hashedPassword, salt]
        )

        const createdUser = res.rows[0] as unknown as User;

        await createUserSession(createdUser);

        return NextResponse.json(
            { status: 'success', message: 'User created successfully', data: { user: createdUser } },
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            { status: 'error', message: 'Could not create user' }, { status: 500 },
        );
    }
}