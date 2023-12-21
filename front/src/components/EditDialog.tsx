import { Box, Breakpoint, Container, Dialog, DialogTitle, IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import QuitIcon from '@mui/icons-material/Close'

export type EditDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    children: JSX.Element
    maxWidth?: Breakpoint
}

export default function EditDialog({open, onClose, title, children, maxWidth}: EditDialogProps) 
{    
    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile: boolean = width <= 768;

    const handleWindowSizeChange = () => setWidth(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (
        <Dialog onClose={onClose} open={open} maxWidth={maxWidth ?? 'lg'} 
            fullWidth fullScreen={isMobile}>
            <Box sx={{ display: 'flex' }}>
                {isMobile &&
                    <IconButton size='medium' onClick={() => onClose()}>
                        <QuitIcon />
                    </IconButton>
                }
            </Box>
            <DialogTitle sx={{ pt: 1 }}>{title}</DialogTitle>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                {children}
            </Box>
        </Dialog>
    )
}