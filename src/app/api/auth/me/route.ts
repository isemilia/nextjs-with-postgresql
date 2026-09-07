import { getCurrentUser } from "@/shared/utils/get-current-user";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { status: 'error', message: 'Could not fetch current user' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            status: 'success',
            message: 'Fetched current user successfully',
            data: { user }
        });
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            { status: 'error', message: 'Could not fetch current user' },
            { status: 500 }
        );
    }

}