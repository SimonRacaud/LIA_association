import { Container, Dialog, DialogTitle, IconButton } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import User from "classes/User";
import EventTeamCardList from "components/EventTeamCardList";
import EventTeamTable from "components/EventTeamTable";
import { UserContextType, useUser } from "context/UserContext";
import TableIcon from '@mui/icons-material/ViewList'
import CardIcon from '@mui/icons-material/CalendarViewMonth'
import { useReducer, useState } from "react";
import TeamService from "services/TeamService";
import { AxiosError } from "axios";

export interface EventDialogProps {
    open: boolean
    event?: Event
    onClose: (refresh: boolean) => void
}

enum ViewMode {
    TABLE,
    CARDS
}

export default function EventShowDialog({ open, event, onClose}: EventDialogProps) {
    const { user }: UserContextType = useUser()
    const [ viewMode, setViewMode ] = useState(ViewMode.TABLE)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const onSubscribeEventTeam = (eventTeam: Team) => {
        const userId = user?.id
        if (userId) {
            // add 'user' to team
            const userMember = eventTeam.members.find((v) => v.id == user.id)
            if (userMember == undefined) {
                // API Update
                TeamService.memberSubscribe(eventTeam.uuid, user.id)
                .then(() => {
                    // The current user isn't already a member
                    eventTeam.members.push(user)
                    forceUpdate();
                })
                .catch((error) => {
                    console.error((error as AxiosError).message)
                    alert("Echec")
                })
            }
        }
    }
    const onUnsubscribeEventTeam = (eventTeam: Team) => {
        const userId = user?.id
        if (userId) {
            // API Update
            TeamService.memberUnsubscribe(eventTeam.uuid, user.id)
            .then(() => {
                // remove 'user" from team
                eventTeam.members = eventTeam.members.filter((v) => v.id != user.id)
                forceUpdate();
            })
            .catch((error) => {
                console.error((error as AxiosError).message)
                alert("Echec")
            })
        }
    }

    return (
        <Dialog onClose={() => onClose(false)} open={open} maxWidth="lg">
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
            {event && 
                (viewMode == ViewMode.CARDS &&
                    <EventTeamCardList event={event} user={user as User} 
                        onSubscribeTeam={onSubscribeEventTeam} 
                        onUnsubscribeTeam={onUnsubscribeEventTeam} />
                    ||
                    <EventTeamTable event={event} user={user as User} 
                        onSubscribeTeam={onSubscribeEventTeam} 
                        onUnsubscribeTeam={onUnsubscribeEventTeam} />
                )
            }
        </Dialog>
    )
}