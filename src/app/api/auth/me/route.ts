import { db } from "@/shared/lib/db";
import { getUserSession } from "@/shared/utils/session"
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await getUserSession();

    if (session) {
        const userId = session.user_id;

        try {
            const res = await db.query(`
                SELECT id, name, email, role, created_at, updated_at 
                FROM users 
                WHERE id = $1
            `, [userId]);
            const user = res.rows[0];

            return NextResponse.json({
                status: 'success',
                message: 'Fetched user successfully',
                data: { user }
            });
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                { status: 'error', message: 'Could not fetch user' },
                { status: 500 }
            );
        }
    }
}