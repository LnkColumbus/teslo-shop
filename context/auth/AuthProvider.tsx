import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'

import axios, { AxiosError } from 'axios';

import { AuthContext, authReducer } from './';

import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import Cookies from 'js-cookie';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

interface Props {
    children?: ReactNode | undefined;
}

export const AuthProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'authenticated') {
        console.log({user: data?.user});
        dispatch({ type: '[Auth] - Login', payload: data.user as IUser});
      }
    }, [status, data]);
    
    
    // useEffect(() => {
    //   checkToken();
    // }, [])
    
    const checkToken = async () => {
        if ( !Cookies.get('token') ) {
            return;
        }
        try {
            const { data } = await tesloApi.get("/user/validate-token");
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }

    const loginUser = async ( email: string, password: string ): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post("/user/login", { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            return false;
        }
    }

    const registerUser = async ( name: string, email: string, password: string ): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await tesloApi.post("/user/register", { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            //TODO: return
            return {
                hasError: false,
            }
        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                const err = error as AxiosError;
                return {
                    hasError: true,
                    message: err.message
                }
            }

            return {
                hasError: true,
                message: 'No se puedo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zipCode');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        
        signOut();
        // Cookies.remove('token');
        // router.reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logout
        }}>
            { children }
        </AuthContext.Provider>
    )
}