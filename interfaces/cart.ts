import { ISize } from './';

export interface ICartProduct {
    _id: string;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    image: string;
    price: number;
    quantity: number;
    size?: ISize;
    slug: string;
    title: string;
}