import { FC, useMemo, useState } from 'react'
import NextLink from 'next/link';

import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'

import { IProduct } from '../../interfaces'

interface Props {
    product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    
    const productImage = useMemo(() => {
        return isHovered 
            ? product.images[1]
            : product.images[0]
    }, [isHovered, product.images]);

    return (
        <Grid
            item
            xs={6}
            sm={4}
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            <Card>
                <NextLink href={`/product/${ product.slug }`} passHref prefetch={ false }>
                    <Link>
                        <CardActionArea>
                            {
                                (product.inStock === 0) && (
                                        <Chip
                                            color="primary"
                                            label="Agotado"
                                            sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                                        />
                                    )
                            }
                            <CardMedia
                                alt={ product.title }
                                className="fadeIn"
                                component="img"
                                image={ productImage }
                                onLoad={ () => setIsImageLoaded( true ) }
                            />
                        </CardActionArea>
                    </Link>    
                </NextLink>
            </Card>
            <Box sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }} className="fadeIn">
                <Typography fontWeight={700}>{ product.title }</Typography>
                <Typography fontWeight={500}>${ product.price }</Typography>
            </Box>
        </Grid>
    )
}
