import { User, UserRole } from "../schemas/user";
import * as z from 'zod';
import { cookies } from "next/headers";
import { db } from "../lib/db";
// import crypto from "crypto";

export const sessionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    userRole: z.enum(UserRole),
    expiresAt: z.string()
})

export type UserSession = z.infer<typeof sessionSchema>;

export const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
export const COOKIE_SESSION_KEY = 'session-id';

export const setSessionCookie = async (session: { id: string, expires_at: string }) => {
    const cookieStore = await cookies();
    cookieStore.set(
        COOKIE_SESSION_KEY,
        session.id,
        {
            expires: new Date(session.expires_at),
            sameSite: 'lax'
        }
    );
}

export const createUserSession = async (user: User) => {
    // 7 days from now
    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000).toISOString();

    const res = await db.query(`
        INSERT INTO sessions (user_id, role, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, expires_at
    `, [user.id, user.role, expiresAt]);

    const session = (res.rows[0] as unknown as { id: string, expires_at: string });
    await setSessionCookie(session)

}