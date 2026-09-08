import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./shared/utils/session";
import { UserRole } from "./shared/schemas/user";

const privateRoutes = ['/private', '/profile'];
const adminRoutes = ['/admin'];

export const proxy = async (request: NextRequest) => {
    const authResponse = (await middlewareAuth(request));

    if (authResponse) {
        return authResponse;
    }

    return NextResponse.next();
}

const middlewareAuth = async (request: NextRequest) => {
    const session = await getUserSession();

    if (privateRoutes.includes(request.nextUrl.pathname)) {
        if (!session) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }
    if (adminRoutes.includes(request.nextUrl.pathname)) {
        if (!session) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        if (session.role !== UserRole.ADMIN) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return null;
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
}