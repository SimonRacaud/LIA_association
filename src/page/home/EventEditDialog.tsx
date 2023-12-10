import { Container, Dialog, DialogTitle } from "@mui/material"
import Event from "classes/Event"
import EventForm from "components/EventForm"

export type EventEditDialog = {
    open: boolean
    onClose: () => void
    toEdit?: Event // Null if we want to create a new event
}

export default function EventEditDialog({open, onClose, toEdit}: EventEditDialog) {
    
    const onSubmitForm = (e: Event) => {
        // TODO : API submit changes/create
        onClose()
    }

    return (
        <Dialog onClose={onClose} open={open} maxWidth='lg' fullWidth={true}>
            <DialogTitle>Création d'un événement</DialogTitle>
            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <EventForm onSubmit={onSubmitForm} initEvent={toEdit} />
            </Container>
        </Dialog>
    )
}