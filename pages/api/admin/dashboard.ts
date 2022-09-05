import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
| {
    numberOfOrders          : number;
    paidOrders              : number; // isPaid: true
    notPaidOrders           : number; 
    numberOfClients         : number; // role: client
    numberOfProducts        : number; 
    productsWithNoInventory : number; // productos sea 0
    lowInventory            : number; // productos con 10 o menos 
}
| { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getData(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.find().count(),
        Order.find({ isPaid: true }).count(),
        User.find({ role: 'client' }).count(),
        Product.find().count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10, $gt: 0 }}).count(),
    ]);
    await db.disconnect();

    return res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    });

}
