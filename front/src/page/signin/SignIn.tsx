import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../../components/Copyright';
import LiaLogo from '../../components/LiaLogo';

import { useUser } from 'context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

export default function SignIn() {
    const {loginUser, isLogged } = useUser()
    const navigate = useNavigate()
    const [isLoginSuccess, setIsLoginSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const checkAuth = async () => {
        const isAuth = await isLogged();

        setIsLoginSuccess(isAuth)
    }
    useEffect(() => {
        checkAuth()
    })
    if (isLoginSuccess) {
        return <Navigate to="/" replace={true} />
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setError(false)
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginData = {
            username: data.get('username')?.toString(),
            password: data.get('password')?.toString(),
        };
        if (!loginData.password || !loginData.username) {
            setError(true)
            setErrorMessage("Nom d'utilisateur ou mot de passe incorrect")
            return // Abort
        }
        loginUser(loginData.username, loginData.password)
        .then((success: boolean) => {
            if (success) {
                navigate('/')
            } else {
                setError(true)
                setErrorMessage('Fatal: Une erreur est survenue')
            }
        })
        .catch((error) => {
            if (error.response != null && error.response.status === 401) {
                setError(true)
                setErrorMessage("Nom d'utilisateur ou mot de passe incorrect")
            } else {
                setError(true)
                setErrorMessage('Une erreur est survenue')
            }
        })
    };

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 2, bgcolor: 'secondary.main', width: 100, height: 100 }}>
                <LiaLogo />
            </Avatar>
            <Typography component="h1" variant="h5">
                Calendrier des équipes
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nom d'utilisateur"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            /> */}
            { error && <Alert severity="error">{errorMessage}</Alert>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Connexion
            </Button>
            <Grid container>
                <Grid item xs>
                <Link href="mailto:simonracaud@gmail.com" variant="body2">
                    Mot de passe oublié ?
                </Link>
                </Grid>
                {/* <Grid item>
                    <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid> */}
            </Grid>
            </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}