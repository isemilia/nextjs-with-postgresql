import { db } from "@/shared/lib/db";
import { signUpSchema } from "@/shared/schemas/auth";
import { generateSalt, hashPassword } from "@/shared/utils/password-hasher";
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

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    try {
        const res = await db.query(`
        INSERT INTO users (name, email, password, salt)
        VALUES ($1, $2, $3, $4)
        RETURNING name, email
    `,
            [data.name, data.email, hashedPassword, salt]
        )

        return NextResponse.json(
            { status: 'success', message: 'User created successfully', data: { user: res.rows[0] } },
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            { status: 'error', message: 'Could not create user' }, { status: 500 },
        );
    }
}