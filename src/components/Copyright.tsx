import { Typography } from "@mui/material";

export default function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © Lia épicerie solidaire '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}