import { db } from "../lib/db";
import { UserRole } from "../schemas/user";
import { getUserSession } from "./session";

export const getCurrentUser = async () => {
    const session = await getUserSession();

    if (!session) {
        console.error('Session not found');
        return null;
    }

    try {
        const res = await db.query(`
        SELECT id, name, email, role, created_at
        FROM users 
        WHERE id = $1
    `, [session.user_id]);

        const user = res.rows[0] as unknown as {
            id: string
            email: string,
            name: string,
            role: UserRole,
        } | null;

        return user;
    } catch (e) {
        console.error(e)
        throw new Error('Could not get current user')
    }
}