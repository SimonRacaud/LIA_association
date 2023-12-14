import { Breakpoint, Container, Dialog, DialogTitle } from "@mui/material"

export type EditDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    children: JSX.Element
    maxWidth?: Breakpoint
}

export default function EditDialog({open, onClose, title, children, maxWidth}: EditDialogProps) 
{    
    return (
        <Dialog onClose={onClose} open={open} maxWidth={maxWidth ?? 'lg'} fullWidth={true}>
            <DialogTitle>{title}</DialogTitle>
            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                {children}
            </Container>
        </Dialog>
    )
}