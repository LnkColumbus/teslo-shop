import { FC, useContext } from 'react'
import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'
import { ItemCounter } from '../ui'

import { initialData } from '../../database/products'
import { CartContext } from '../../context'
import { ICartProduct } from '../../interfaces'

interface Props {
    editable?: boolean;
}

// const productsInCart = [ 
//     initialData.products[0],
//     initialData.products[1],
//     initialData.products[2],
// ]

export const CartList: FC<Props> = ({ editable = false  }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = ( product: ICartProduct, newQuantityValue: number ) => {
        const newValue = Math.max( product.quantity + newQuantityValue, 1 );
        product.quantity = newValue;
        updateCartQuantity( product );
    }

    const onRemoveCartProduct = ( product: ICartProduct ) => {
        removeCartProduct( product );
    }

    return (
        <>
            {
                cart.map( product => ( 
                    <Grid container spacing={2} key={ product.slug + product.size } sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            <NextLink href={`/product/${product.slug}`} passHref>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            image={ `/products/${ product.image }` }
                                            component="img"
                                            sx={{ borderRadius: '5px' }}
                                            alt="No image"
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body1">{ product.title }</Typography>
                                <Typography variant="body1">Talla: <strong>{ product.size }</strong></Typography>
                                {
                                    editable
                                        ? (
                                            <ItemCounter
                                                currentValue={ product.quantity }
                                                maxValue={ 10 }
                                                updatedQuantity={ ( value ) => onNewCartQuantityValue( product, value ) }
                                            />
                                        )
                                        : (
                                            <Typography>{ product.quantity } { product.quantity > 1 ? 'producto' : 'producto'}</Typography>
                                        )
                                }
                        </Box>
                        </Grid>
                        <Grid item display="flex" alignItems="center" flexDirection="column" xs={2}>
                            <Typography variant="subtitle1">${ product.price }</Typography>
                            {
                                editable && (
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        onClick={ () => onRemoveCartProduct( product ) }
                                    >
                                        Remover
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
