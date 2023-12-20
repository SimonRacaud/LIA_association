import { Container, Dialog, DialogTitle } from "@mui/material"
import { AxiosError } from "axios"
import Event from "classes/Event"
import EventForm from "components/EventForm"
import EventService from "services/EventService"

export type EventEditDialog = {
    open: boolean
    onClose: (refresh: boolean) => void
    toEdit?: Event // Null if we want to create a new event
}

export default function EventEditDialog({open, onClose, toEdit}: EventEditDialog) 
{    
    const networkEvent = EventService.getInstance();

    const onSubmitForm = async (e: Event) => {
        try {
            if (!toEdit) {
                // Create mode
                await networkEvent.create(e)
            } else {
                // Update mode
                await networkEvent.update(e)
            }
        } catch (error) {
            console.error("Network error:", (error as AxiosError)?.message)
            alert("Echec")
        }
        onClose(true)
    }

    return (
        <Dialog onClose={() => onClose(false)} open={open} maxWidth='sm' fullWidth>
            <DialogTitle>Création d'un événement</DialogTitle>
            <Container>
                <EventForm onSubmit={onSubmitForm} initEvent={toEdit} />
            </Container>
        </Dialog>
    )
}