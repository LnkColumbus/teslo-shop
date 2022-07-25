import { createContext } from 'react';

import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
    isLoaded: boolean;
    isOrdered: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress

    // Methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void;
    removeCartProduct: (product: ICartProduct) => void;

    // Orders
    createOrder: () => Promise<{
        hasError: boolean;
        message: string;
    }>;
}

export const CartContext = createContext({} as ContextProps);