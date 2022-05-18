import { useContext, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts'
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';

import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';
import { CartContext } from '../../context';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    gender: product.gender,
    image: product.images[0],
    price: product.price,
    quantity: 1,
    size: undefined,
    slug: product.slug,
    title: product.title,
  });

  const onSelectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }));
  }

  const onAddProduct = () => {
    if( !tempCartProduct.size ) return;

    addProductToCart( tempCartProduct );
    router.push('/cart');
  }

  const onUpdatedQuantity = ( value: number ) => {
    const newValue = Math.max( tempCartProduct.quantity + value, 1 );
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity: newValue
    }))
  } 

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={ product.images } />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* titulos */}
            <Typography variant="h1" component="h1">{ product.title }</Typography>
            <Typography variant="subtitle1" component="h2">${ product.price }</Typography>
            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={ onUpdatedQuantity }
                maxValue={ product.inStock > 10 ? 10 : product.inStock }
              />
              <SizeSelector
                selectedSize={ tempCartProduct.size }
                sizes={ product.sizes }
                onSelectedSize={ onSelectedSize }
              />
            </Box>

            {/* TODO: Agregar al carrito */}

            {
              ( product.inStock > 0 )
                ? (
                    <Button
                      color="secondary"
                      className="circular-btn"
                      onClick={ onAddProduct }
                    >
                      {
                        tempCartProduct.size
                          ? 'Agregar al carrito'
                          : 'Seleccione una talla'
                      }
                    </Button>
                  )
                : (
                    <Chip label="No hay disponibles" color="error" variant="outlined" />
                  )
            }
            
            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto... SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
//   const { slug } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);

//   if ( !product ) {
//     return {
//         redirect: {
//             destination: '/',
//             permanent: false
//         }
//     }
// }

//   return {
//     props: {
//       product      
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const data = await dbProducts.getAllProductSlug(); // your fetch function here

  return {
    paths: data.map( ({ slug }) => ({
      params: { slug }
    })),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductBySlug( slug ); // your fetch function here

  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400,
  }
}

export default ProductPage