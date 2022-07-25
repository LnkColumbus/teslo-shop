import { FC, ReactNode, useEffect, useReducer } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { tesloApi } from '../../api';

export interface CartState {
    isLoaded: boolean;
    isOrdered: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    isOrdered: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,

    shippingAddress: undefined
}

interface Props {
    children?: ReactNode | undefined;
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): [];
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: []});
        }
    }, []);

    useEffect(() => {
        if( Cookie.get('firstName') ) {
            const cookieAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName : Cookie.get('lastName') || '',
                address  : Cookie.get('address') || '',
                address2 : Cookie.get('address2') || '',
                zipCode  : Cookie.get('zipCode') || '',
                city     : Cookie.get('city') || '',
                country  : Cookie.get('country') || '',
                phone    : Cookie.get('phone') || '',
            }
            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: cookieAddress})
        }
    }, [])
    

    useEffect(() => {
        //TODO: arreglar para que vacie el carrito cuando se hace una orden
        if (state.cart.length > 0) {
            Cookie.set('cart', JSON.stringify(state.cart));
        }

        if (state.isOrdered) {
            Cookie.set('cart', JSON.stringify(state.cart));
        }
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

    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');
        Cookie.set('zipCode', address.zipCode);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);
        
        dispatch({ type: '[Cart] - Update Address', payload: address });
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
        if ( !state.shippingAddress ) {
            throw new Error("No hay dirección de entrega");
        }

        const body: IOrder = {
            orderItems: state.cart.map( product => ({
                ...product,
                size: product.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        }

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);
            dispatch({ type: '[Cart] - Order complete' });
            
            return {
                hasError: false,
                message: data._id!
            }
        } catch (error: any) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data as string
                }
            }
            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            createOrder,
            updateCartQuantity,
            updateAddress,
            removeCartProduct
        }}>
            { children }
        </CartContext.Provider>
    )
}