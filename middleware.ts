import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwtVerify } from 'jose';

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log({session});

    if ( !session ) {
        let url = req.nextUrl.clone();
        url.basePath = '/auth/login?p=';
        url.pathname = req.nextUrl.pathname;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();

    // const token = req.cookies.get('token') || '';

    // let url = req.nextUrl.clone();
    // url.basePath = '/auth/login?p=';
    // url.pathname = req.nextUrl.pathname;

    // try {
    //     await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
    //     return NextResponse.next();
    // } catch (error) {
    //     return NextResponse.redirect(url);
    // }
}

export const config = {
    matcher: '/checkout/:path*',
}