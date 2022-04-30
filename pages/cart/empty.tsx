import React from 'react'
import NextLink from 'next/link';

import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';

import { ShopLayout } from '../../components/layouts';

const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vacío" pageDescription="No hay articulos en el carrito de compras">
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="calc(100vh - 200px)"
            sx={{ flexDirection: { xs: 'column', sm: 'row' }}}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display="flex" alignItems="center" flexDirection="column">
                <Typography>Su carrito esta vacío</Typography>
                <NextLink href="/" passHref>
                    <Link>
                        <Typography color="secondary" variant="h4">Regresar</Typography>
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage;