import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data =
| { message: string }
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
            
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    // Verificar que tengamos un usuario
    const session: any = await getSession({ req });
    if ( !session ) {
        return res.status(401).json({ message: 'Debe estar autenticado para realizar una orden' });
    }

    // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds }});

    try {
        const subTotal = orderItems.reduce( (prev, curr) => {
            const currentPrice = dbProducts.find( prod => prod.id === curr._id )?.price;
            if ( !currentPrice ) {
                throw new Error("Verifique el carrito de nuevo, producto no existe");
            }
            return (currentPrice * curr.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if ( total !== backendTotal ) {
            throw new Error("El total no cuadra con el monto");
        }

        // Todo bien hasta este punto
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        await newOrder.save();
        await db.disconnect();
        
        return res.status(201).json( newOrder );

    } catch (error: any) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: error.message || 'Revise logs del servidor' })
    }
}
