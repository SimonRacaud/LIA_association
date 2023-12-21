import { Container, Dialog, DialogTitle } from "@mui/material"
import { AxiosError } from "axios"
import Event from "classes/Event"
import ErrorNotification from "components/ErrorNotification"
import EventForm from "components/EventForm"
import NetErrorBody from "models/ErrorResponse"
import { useState } from "react"
import EventService from "services/EventService"

export type EventEditDialog = {
    open: boolean
    onClose: (refresh: boolean) => void
    toEdit?: Event // Null if we want to create a new event
}

export default function EventEditDialog({open, onClose, toEdit}: EventEditDialog) 
{
    const [ error, setError ] = useState<NetErrorBody>()
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
            onClose(true)
        } catch (error) {
            const netError = error as AxiosError
            const errReason = netError.response?.data as NetErrorBody;
            console.error(netError.message)
            setError(errReason)
        }
    }

    return (
        <Container>
            <Dialog onClose={() => onClose(true)} open={open} maxWidth='sm' fullWidth>
                <DialogTitle>Création d'un événement</DialogTitle>
                <Container>
                    <EventForm onSubmit={onSubmitForm} initEvent={toEdit} />
                </Container>
            </Dialog>
            <ErrorNotification show={error != undefined} 
                onClose={() => setError(undefined)} 
                netError={error} />
        </Container>
    )
}