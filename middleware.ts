import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwtVerify } from 'jose';

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.redirect( new URL('/api/auth/unauthorized', req.url) );
        }

        const requestedPage = req.nextUrl.pathname;
        return NextResponse.redirect( new URL(`/auth/login?p=${requestedPage}`, req.url) );
    }

    const validRoles = ['admin', 'super-user', 'SEO'];

    if (req.nextUrl.pathname.startsWith('/admin')) {
        if(!validRoles.includes(session.user.role)) {
            return NextResponse.redirect( new URL('/', req.url) );
        }
    }

    if (req.nextUrl.pathname.startsWith('/api/admin')) {
        if (!validRoles.includes(session.user.role)) {
            return NextResponse.redirect( new URL('/api/auth/unauthorized', req.url) );
        }
    }

    return NextResponse.next();
    
}

export const config = {
    matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
}