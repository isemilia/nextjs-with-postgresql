import { User, UserRole } from "../schemas/user";
import * as z from 'zod';
import { cookies } from "next/headers";
import { db } from "../lib/db";

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
    const expiresAt = new Date(new Date().getTime() + SESSION_EXPIRATION_SECONDS * 1000).toISOString();

    const res = await db.query(`
        INSERT INTO sessions (user_id, role, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, expires_at
    `, [user.id, user.role, expiresAt]);

    const session = (res.rows[0] as unknown as { id: string, expires_at: string });
    await setSessionCookie(session)
}

export const removeUserSession = async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value

    if (!sessionId) {
        return
    }

    await deleteSession(sessionId);
}

export const deleteSession = async (sessionId: string) => {
    const cookieStore = await cookies();
    await db.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
    cookieStore.delete(COOKIE_SESSION_KEY);

}

export const getUserSession = async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY);

    if (!sessionId) {
        return null;
    }

    return getUserSessionById(sessionId.value);
}

export const getUserSessionById = async (sessionId: string) => {
    const res = await db.query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);
    const session = res.rows[0] as unknown as { user_id: string, id: string, expires_at: string, role: UserRole };

    if (!session) {
        return null
    }

    const expiresAt = new Date(session.expires_at).getTime();
    const now = new Date().getTime();

    if (expiresAt < now) {
        await deleteSession(session.id);
        return null;
    }

    return session;
}