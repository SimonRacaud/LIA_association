import { Alert, Snackbar } from "@mui/material";
import NetErrorBody from "models/ErrorResponse";

export type ErrorNotificaitonProps = {
    show: boolean
    onClose: () => void
    message?: string
    netError?: NetErrorBody
}

export default function ErrorNotification({ show, onClose, message, netError }: ErrorNotificaitonProps)
{
    return (
        <Snackbar open={show} autoHideDuration={3000} onClose={onClose}>
            <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
            {netError && `${netError.message}: ${netError.data ?? ''}`
                || message && message
            }
            </Alert>
        </Snackbar>
    )
}