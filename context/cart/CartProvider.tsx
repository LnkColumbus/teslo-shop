import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';

import { ICartProduct } from '../../interfaces';

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
}

interface Props {
    children?: ReactNode | undefined;
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cartInCookies = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
            dispatch({ type: '[Cart] - LoadCart from cookes | storage', payload: cartInCookies })
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookes | storage', payload: []})
        }
    }, []);

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {

        const numberOfItems = state.cart.reduce( (prev, curr) => curr.quantity + prev, 0)
        const subTotal = state.cart.reduce( (prev, curr) => (curr.price * curr.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * ( taxRate + 1 )
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
        
    }, [state.cart]);

    const addProductToCart = ( product: ICartProduct ) => {
        const productInCart = state.cart.some( prod => prod._id === product._id );
        if ( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload:[...state.cart, product ]});
        
        const productInCartButDifferentSize = state.cart.some( prod => prod._id === product._id && prod.size === product.size );
        if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product ]});

        // Acumular
        const updatedProducts = state.cart.map( prod => {
            if( prod._id !== product._id ) return prod;
            if( prod.size !== product.size ) return prod;

            // Actualizar la cantidad
            prod.quantity += product.quantity;
            return prod;
        });

        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
    }

    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product })
    }

    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct
        }}>
            { children }
        </CartContext.Provider>
    )
}