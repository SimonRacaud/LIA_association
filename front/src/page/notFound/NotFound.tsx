import { Box, Button, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="div" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        Maybe it decided to go on a vacation! 🏖️
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Go Home
      </Button>
    </Box>
  );
}
