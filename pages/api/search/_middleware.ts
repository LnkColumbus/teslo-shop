import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware( req: NextRequest, ev: NextFetchEvent ) {

    const q = req.page.params?.q || '';

    if ( q.length === 0 ) {
        // return res.status(400).json({ message: 'El id no es válido ' + id });
        return new Response( JSON.stringify({ message: 'Debe de especificar el termino de busqueda'}), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return NextResponse.next();
}