// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Order, Product, User } from '../../models';

type Data = {
  message: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    if ( process.env.NODE_ENV === 'production' ) {
        return res.status(401).json({ message: 'No tiene acceso a este servicio' });
    }

    try {
        await db.connect();
        
        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users );

        await Product.deleteMany();
        await Product.insertMany( seedDatabase.initialData.products );

        await Order.deleteMany();

        await db.disconnect();
        res.status(200).json({ message: 'Proceso realizado correctamente' });

    } catch(error) {
        await db.disconnect();
        console.log(error);
        res.status(500).json({ message: 'Algo salió mal, revisar'});
    }
}
