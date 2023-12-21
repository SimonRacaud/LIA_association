import { Box, Container, Dialog, DialogTitle, IconButton } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import User from "classes/User";
import EventTeamCardList from "components/EventTeamCardList";
import EventTeamTable from "components/EventTeamTable";
import { UserContextType, useUser } from "context/UserContext";
import TableIcon from '@mui/icons-material/ViewList'
import CardIcon from '@mui/icons-material/CalendarViewMonth'
import QuitIcon from '@mui/icons-material/Close'
import { useEffect, useReducer, useState } from "react";
import TeamService from "services/TeamService";
import { AxiosError } from "axios";
import ErrorNotification from "components/ErrorNotification";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";

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
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile: boolean = width <= 768;
    const [ viewMode, setViewMode ] = useState(isMobile? ViewMode.CARDS : ViewMode.TABLE)

    const handleWindowSizeChange = () => setWidth(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

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
                .catch((error: any) => {
                    const errorBody = error.response?.data as NetErrorBody
                    console.error(error.message)
                    if (errorBody) {
                        setErrorNet(NetFailureBody)
                    } else {
                        setErrorNet(errorBody)
                    }
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
                const errorNetwork = error as AxiosError
                const errorBody = errorNetwork.response?.data as NetErrorBody
                console.error(errorNetwork.message)
                if (errorBody) {
                    setErrorNet(NetFailureBody)
                } else {
                    setErrorNet(errorBody)
                }
            })
        }
    }

    return (
        <Container>
            <Dialog onClose={() => onClose(false)} open={open} maxWidth="lg" fullScreen={isMobile}>
                <Box sx={{
                    display: 'flex',
                }}>
                    {isMobile &&
                        <IconButton size='medium' onClick={() => onClose(false)}>
                            <QuitIcon />
                        </IconButton>
                    }
                    <Container sx={{ display:'flex', justifyContent:'end'}}>
                        <IconButton size='medium' onClick={() => setViewMode(ViewMode.TABLE)}>
                            <TableIcon />
                        </IconButton>
                        <IconButton size='medium' onClick={() => setViewMode(ViewMode.CARDS)}>
                            <CardIcon />
                        </IconButton>
                    </Container>
                </Box>
                <DialogTitle sx={{ pt: 1 }}>Équipes de {event?.title}</DialogTitle>
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
            <ErrorNotification show={errorNet != undefined}
                onClose={() => setErrorNet(undefined)}
                netError={errorNet}
            />
        </Container>
    )
}