import { useContext, useState } from 'react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'
import { tesloApi } from '../../api'

type FormData = {
    name: string,
    email: string,
    password: string,
}

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async ({ name, email, password }: FormData ) => {
        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if ( hasError ) {
            setShowError(true);
            setErrorMessage( message! )
            setTimeout(() => {
                setShowError(false);
            }, 3000);

            return;
        }
        
        router.replace('/');
    }

    return (
        <AuthLayout title="Registro">
            <Box component="form" onSubmit={ handleSubmit(onRegisterForm) } sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">Crear cuenta</Typography>
                        <Chip
                            label="No reconocemos ese usuario / password"
                            color="error"
                            icon={ <ErrorOutline /> }
                            className="fadeIn"
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            label="Nombre"
                            variant="filled" 
                            fullWidth
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                            {
                                ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo debe tener 2 caracteres'}
                                })
                            }    
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="email"
                            label="Correo" 
                            variant="filled"
                            fullWidth
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                            {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            label="Contraseña" 
                            variant="filled"
                            fullWidth
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                            {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres'}
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            color="secondary"
                            className="circular-btn"
                            size="large"
                            fullWidth
                        >
                            Registrarse
                        </Button>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="end">
                        <NextLink href="/auth/login" passHref>
                            <Link underline="always">
                                <Typography>¿Ya tienes cuenta?</Typography>
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    )
}

export default RegisterPage