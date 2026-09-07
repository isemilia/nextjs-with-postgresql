import { removeUserSession } from "@/shared/utils/session"
import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        await removeUserSession();

        return NextResponse.json({
            status: 'success',
            message: 'User session removed successfully'
        });
    } catch (e) {
        console.error(e)
        return NextResponse.json({
            status: 'error',
            message: 'Could not remove user session'
        },
            { status: 500 }
        );
    }
}