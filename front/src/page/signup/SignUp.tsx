import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../../components/Copyright';
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
    const navigate = useNavigate()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
        // TODO : API call => submit data
        navigate('/settings')
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Création d'un compte utilisateur
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        autoComplete="Nom d'utilisateur"
                        name="username"
                        required
                        fullWidth
                        id="username"
                        label="Nom d'utilisateur"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Adresse e-mail"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Inscription
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button onClick={() => navigate('/settings')}>Annuler</Button>
                </Grid>
            </Grid>
            </Box>
        </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}