import { db } from "@/shared/lib/db";
import { signInSchema } from "@/shared/schemas/auth";
import { User, UserRole } from "@/shared/schemas/user";
import { comparePasswords } from "@/shared/utils/password-hasher";
import { createUserSession } from "@/shared/utils/session";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export const POST = async (request: NextRequest) => {
    const data = await request.json() as z.infer<typeof signInSchema>;

    try {
        const res = await db.query(`
            SELECT id, name, email, role, password, salt, created_at, updated_at 
            FROM users 
            WHERE email = $1
        `, [data.email]);

        const user = res.rows[0] as unknown as {
            password: string,
            salt: string,
            id: string
            email: string,
            name: string,
            role: UserRole,
        } | null;

        if (!user) {
            return NextResponse.json(
                { status: 'error', message: 'Incorrect email or password' }, { status: 400 },
            );
        }

        const isCorrectPassword = await comparePasswords(data.password, user.salt, user.password);

        if (isCorrectPassword) {
            await createUserSession(user);

            const { password, salt, ...safeUser } = user;

            return NextResponse.json(
                { status: 'success', message: 'Signed in successfully', data: { user: safeUser } },
            );
        }

        return NextResponse.json(
            { status: 'error', message: 'Incorrect email or password' }, { status: 400 },
        );

    } catch (e) {
        console.error(e)
        return NextResponse.json(
            { status: 'error', message: 'Could not sign in' }, { status: 500 },
        );
    }

}