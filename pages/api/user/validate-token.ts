import type { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data =
| { message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return checkJWT( req, res )
    
        default:
            res.status(400).json({
                message: 'Bad Request'
            })
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { token = '' } = req.cookies;

    let userID = '';

    try {
        userID = await jwt.isValidToken( token );
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorización no es válido'})
    }

    await db.connect();
    const user = await User.findById( userID ).lean();
    await db.disconnect();

    if ( !user ) {
        return res.status(400).json({ message: 'No existe un usuario con ese ID' })
    }

    const { email, name, role, _id } = user;

    return res.status(200).json({
        user: {
            email,
            name, 
            role
        },
        token: jwt.signToken( _id, email )
    })
}
