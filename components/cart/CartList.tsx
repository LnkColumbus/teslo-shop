import { FC } from 'react'
import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'
import { ItemCounter } from '../ui'

import { initialData } from '../../database/products'

interface Props {
    editable?: boolean;
}

const productsInCart = [ 
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

export const CartList: FC<Props> = ({ editable = false  }) => {
  return (
    <>
        {
            productsInCart.map( product => ( 
                <Grid container spacing={2} key={ product.slug } sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/* TODO: Llevar a la página del producto */}
                        <NextLink href="/product/slug" passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={ `/products/${ product.images[0] }` }
                                        component="img"
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{ product.title }</Typography>
                            <Typography variant="body1">Talla: <strong>M</strong></Typography>
                            {
                                editable
                                    ? ( <ItemCounter /> )
                                    : ( <Typography>3 items</Typography> )
                            }
                       </Box>
                    </Grid>
                    <Grid item display="flex" alignItems="center" flexDirection="column" xs={2}>
                        <Typography variant="subtitle1">${ product.price }</Typography>
                        {
                            editable && (
                                <Button variant="text" color="secondary">
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
