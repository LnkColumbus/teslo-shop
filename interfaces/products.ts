export interface IProduct {
    _id: string;
    createdAt: string;
    description: string;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    updatedAt: string;
}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';