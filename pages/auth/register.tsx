import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link'

import { useForm } from 'react-hook-form'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'

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
        
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password, name });
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
                        <NextLink
                            href={ router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                            passHref
                        >
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

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });

    const { p = '/' } = query;

    if ( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage