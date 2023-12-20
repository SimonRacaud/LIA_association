import { Button, Container, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Event from "classes/Event";
import User, { UserType } from "classes/User";
import ShowDate from "components/ShowDate";
import { useEffect, useState } from "react";
import EventShowDialog from "./EventShowDialog";
import EventEditDialog from './EventEditDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UserContext";
import { Item } from "components/EventTeamCardList";
import AlertDialog from "components/AlertDialog";
import LogoutIcon from '@mui/icons-material/Logout'
import EventService from "services/EventService";
import Paginated, { PaginationQuery } from "models/Paginated";

type HomeHeaderProps = {
    onClickSettings: () => void
    onClickCreateEvent: () => void
    onClickLogout: () => void
    user?: User
}
function HomeHeader({ onClickSettings, onClickCreateEvent, onClickLogout, user }: HomeHeaderProps) {
    return (
        <Stack sx={{ 
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            my: 1
         }}>
            {user?.role == UserType.ADMIN &&
                <IconButton aria-label="settings" size='large' onClick={onClickSettings}>
                    <SettingsIcon />
                </IconButton>
            }
            {user?.role == UserType.ADMIN &&
                <IconButton aria-label="create" size='large' onClick={onClickCreateEvent}>
                    <CreateIcon />
                </IconButton>
            }
            <IconButton aria-label="logout" size='large' onClick={onClickLogout} >
                <LogoutIcon />
            </IconButton>
            <Typography variant="caption" color='text.secondary' sx={{
                mr: 1
            }}>{user?.username}</Typography>
            {user?.role == UserType.ADMIN &&
                <Item sx={{ mx: 2 }}>Administrateur</Item>
            }
        </Stack>
    )
}

export default function HomePage() {
    const [ selectedEvent, setSelecteEvent ] = useState<Event | undefined>()
    const [ openAlertDialog, setOpenAlertDialog ] = useState(false)
    const [ openShowDialog, setOpenShowDialog ] = useState(false)
    const [ openEditDialog, setOpenEditDialog ] = useState(false)
    const [ eventList, setEventList ] = useState<Paginated<Event>>()
    const [listQuery, setListQuery ] = useState<PaginationQuery>({
        page: 1,
        size: 10
    })
    const { user, logoutUser } = useUser()
    const navigate = useNavigate()
    const networkEvent = EventService.getInstance();

    useEffect(() => {
        loadEventList();
    }, [])

    const loadEventList = async () => {
        // API call
        setEventList(
            await networkEvent.getList(listQuery.page, listQuery.size)
        )
    }
    const onCloseDialog = () => {
        setOpenShowDialog(false)
        setOpenEditDialog(false)
        setSelecteEvent(undefined)
        loadEventList()
    }
    const onEditEvent = (event: Event) => () => {
        setSelecteEvent(event)
        setOpenEditDialog(true)
    }
    const onDeleteEvent = (uuid: string) => () => {
        setSelecteEvent(_getEventFromUuid(uuid))
        setOpenAlertDialog(true)
    }
    const onApplyDeleteEvent = async () => {
        setOpenAlertDialog(false)
        if (selectedEvent) {
            // API call : remove event
            await networkEvent.remove(selectedEvent.uuid)
            // Refresh list
            loadEventList();
        }
    }
    const onCreateEvent = () => {
        setSelecteEvent(undefined)
        setOpenEditDialog(true)
    }
    const onOpenSettings = () => {
        navigate('/settings')
    }
    const _getEventFromUuid = (uuid: string) => {
        return eventList?.data.find((e: Event) => e.uuid == uuid)
    }
    const onLogout = () => {
        logoutUser()
        navigate('/login')
    }

    return (
        <Container>
            <HomeHeader onClickSettings={onOpenSettings} 
                onClickCreateEvent={onCreateEvent} user={user} onClickLogout={onLogout} />
            <TableContainer component={Paper} >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Événement</TableCell>
                            <TableCell align="right">Montrer</TableCell>
                            {user?.role == UserType.ADMIN &&
                                <TableCell align="right">Éditer</TableCell>
                            }
                            {user?.role == UserType.ADMIN &&
                                <TableCell align="right">Supprimer</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventList?.data.map((event: Event) => (
                            <TableRow
                            key={event.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ minWidth: 90 }}> 
                                    <ShowDate dateDayjs={event.date} />
                                </TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" onClick={() => {
                                    setSelecteEvent(event)
                                    setOpenShowDialog(true)
                                    }}>Montrer</Button>
                                </TableCell>
                                {user?.role == UserType.ADMIN &&
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onEditEvent(event)} 
                                        disabled={user?.role != UserType.ADMIN}>Éditer</Button>
                                </TableCell>
                                }
                                {user?.role == UserType.ADMIN &&
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onDeleteEvent(event.uuid)} 
                                        disabled={user?.role != UserType.ADMIN}>Supprimer</Button>
                                </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination count={5} color="primary" sx={{ my: 2 }} disabled />
                <EventShowDialog open={openShowDialog} event={selectedEvent} onClose={onCloseDialog} ></EventShowDialog>
                <EventEditDialog open={openEditDialog} onClose={onCloseDialog} 
                    toEdit={selectedEvent} />
            </TableContainer>
            <AlertDialog open={openAlertDialog} 
                onClose={() => setOpenAlertDialog(false)} 
                onAgree={onApplyDeleteEvent} 
                question="Confirmer la suppression ?" />
        </Container>
    )
}