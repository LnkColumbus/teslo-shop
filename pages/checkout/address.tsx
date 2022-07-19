import { useContext } from 'react';
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import Cookies from 'js-cookie';

import { ShopLayout } from '../../components/layouts'
import { countries } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zipCode: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName : Cookies.get('firstName') || '' ,
        lastName  : Cookies.get('lastName') || '' ,
        address   : Cookies.get('address') || '' ,
        address2  : Cookies.get('address2') || '' ,
        zipCode   : Cookies.get('zipCode') || '' ,
        city      : Cookies.get('city') || '' ,
        country   : Cookies.get('country') || '' ,
        phone     : Cookies.get('phone') || '' ,
    }
}

const AddressPage = () => {

    const router = useRouter();
    const { updateAddress } = useContext(CartContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onSubmit = (data: FormData) => {
        updateAddress( data );
        router.push('/checkout/summary');
    }

    return (
        <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h1" component="h1">Dirección</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                            {
                                ...register("firstName", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message }
                            {
                                ...register("lastName", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección 1"
                            variant="filled"
                            fullWidth
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                            {
                                ...register("address", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección 2 (opcional)"
                            variant="filled"
                            fullWidth
                            {
                                ...register("address2")
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Código Postal"
                            variant="filled"
                            fullWidth
                            error={ !!errors.zipCode }
                            helperText={ errors.zipCode?.message }
                            {
                                ...register("zipCode", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                            {
                                ...register("city", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="País"
                                defaultValue={ Cookies.get('country') || countries[0].code }
                                error={ !!errors.country }
                                helperText={ errors.country?.message }
                                {
                                    ...register("country", {
                                        required: "Campo obligatorio"
                                    })
                                }
                            >
                                {
                                    countries.map( country => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                            {
                                ...register("phone", {
                                    required: "Campo obligatorio"
                                })
                            }
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button
                        color="secondary"
                        className="circular-btn"
                        size="large"
                        type="submit"
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

export default AddressPage