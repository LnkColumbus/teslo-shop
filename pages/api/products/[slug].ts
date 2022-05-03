import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models';

type Data =
| { message: string }
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getProductBySlug( req, res );
    
        default:
            return res.status(400).json({ message: 'Método no existe'});
    }
}

const getProductBySlug = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    const { slug } = req.query;

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug }).lean();
        await db.disconnect();

        if ( !productInDB ) {
            return res.status(400).json({ message: 'No se encontró el producto'});
        }

        return res.status(200).json( productInDB );
    } catch (error: any) {
        await db.disconnect();
        console.error(error);
        return res.status(500).json({ message: error.errors.status.message });
    }
}