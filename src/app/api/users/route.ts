import { db } from '@/shared/lib/db'
import { NextRequest } from 'next/server';

export const GET = async () => {
    const res = await db.query('SELECT * FROM users');

    return Response.json(res.rows);
}

export const POST = async (request: NextRequest) => {
    const body: { name: string } = await request.json();

    try {
        const res = await db.query(`
        INSERT INTO users (name)
        VALUES ($1)
        RETURNING *
        `, [body.name]);

        return Response.json({ status: 'success', data: { user: res.rows[0] } }, { status: 200 });
    } catch (e) {
        console.error(e);

        return Response.json({ status: 'error' }, { status: 500 });
    }

}