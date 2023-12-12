import { Container, Dialog, DialogTitle, IconButton } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import User from "classes/User";
import EventTeamCardList from "components/EventTeamCardList";
import EventTeamTable from "components/EventTeamTable";
import { UserContextType, useUser } from "context/UserContext";
import TableIcon from '@mui/icons-material/ViewList'
import CardIcon from '@mui/icons-material/CalendarViewMonth'
import { useState } from "react";

export interface EventDialogProps {
    open: boolean
    event: Event | undefined
    onClose: () => void
}

enum ViewMode {
    TABLE,
    CARDS
}

export default function EventShowDialog({ open, event, onClose}: EventDialogProps) {
    const { user }: UserContextType = useUser()
    const [ viewMode, setViewMode ] = useState(ViewMode.TABLE)

    const onSubscribeEventTeam = (eventTeam: Team) => {
        const userId = user?.id
        if (userId) {
            // add 'user' to team
            const userMember = eventTeam.members.find((v) => v.id == user.id)
            if (userMember == undefined) {
                // The current user isn't already a member
                eventTeam.members.push(user)
                // TODO : API Update
            }
        }
    }
    const onUnsubscribeEventTeam = (eventTeam: Team) => {
        const userId = user?.id
        if (userId) {
            // remove 'user" from team
            eventTeam.members = eventTeam.members.filter((v) => v.id != user.id)
            // TODO : API Update
        }
    }

    return (
        <Dialog onClose={onClose} open={open} maxWidth="lg">
            <DialogTitle>{event?.title}</DialogTitle>
            <Container sx={{
                position: 'absolute',
                top: 5,
                right: 0,
                display: 'flex',
                justifyContent: 'end'
            }}>
                <IconButton size='medium' onClick={() => setViewMode(ViewMode.TABLE)}>
                    <TableIcon />
                </IconButton>
                <IconButton size='medium' onClick={() => setViewMode(ViewMode.CARDS)}>
                    <CardIcon />
                </IconButton>
            </Container>
            {viewMode == ViewMode.CARDS &&
                <EventTeamCardList event={event as Event} user={user as User} 
                    onSubscribeTeam={onSubscribeEventTeam} 
                    onUnsubscribeTeam={onUnsubscribeEventTeam} />
                ||
                <EventTeamTable event={event as Event} user={user as User} 
                    onSubscribeTeam={onSubscribeEventTeam} 
                    onUnsubscribeTeam={onUnsubscribeEventTeam} />
            }
        </Dialog>
    )
}