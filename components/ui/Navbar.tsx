import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

import { CartContext, UIContext } from '../../context';

export const Navbar = () => {

    const { toggleSideMenu } = useContext(UIContext);
    const { numberOfItems } = useContext(CartContext);

    const { push, route } = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if ( searchTerm.trim().length === 0 ) return;
        push(`/search/${ searchTerm }`);
    } 
    
    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display="flex" alignItems="center">
                        <Typography variant="h6">Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>
                
                <Box flex={ 1 } />

                <Box
                    className="fadeIn"
                    sx={{ display: isSearchVisible ? 'none' :  { xs: 'none', sm: 'block' } }}
                >
                    <NextLink href="/category/men" passHref>
                        <Link>
                            <Button color={ route === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href="/category/women" passHref>
                        <Link>
                            <Button color={ route === '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href="/category/kid" passHref>
                        <Link>
                            <Button color={ route === '/category/kid' ? 'primary' : 'info' }>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={ 1 } />

                {/* Pantallas grandes */}
                {
                    isSearchVisible
                        ? 
                        (
                            <Input
                                autoFocus
                                className="fadeIn"
                                value={ searchTerm }
                                onChange={ (event) => setSearchTerm( event.target.value ) }
                                onKeyPress={ event => event.key === 'Enter' ? onSearchTerm() : null }
                                type='text'
                                placeholder="Buscar..."
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ () => setIsSearchVisible( false ) }
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        :
                        (
                            <IconButton
                                className="fadeIn"
                                onClick={ () => setIsSearchVisible( true ) }
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }
                

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' }}}
                    onClick={ toggleSideMenu }
                >
                    <SearchOutlined />
                </IconButton>
                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>
                <Button onClick={ toggleSideMenu }>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}
