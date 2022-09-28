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
        const product = await Product.findOne({ slug }).lean();
        await db.disconnect();

        if ( !product ) {
            return res.status(400).json({ message: 'No se encontró el producto'});
        }

        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });

        return res.status(200).json( product );
    } catch (error: any) {
        await db.disconnect();
        console.error(error);
        return res.status(500).json({ message: error.errors.status.message });
    }
}