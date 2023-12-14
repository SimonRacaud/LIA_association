import { Button, Container, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import User, { UserType } from "classes/User";
import ShowDate from "components/ShowDate";
import { useState } from "react";
import EventShowDialog from "./EventShowDialog";
import EventEditDialog from './EventEditDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UserContext";
import { Item } from "components/EventTeamCardList";
import AlertDialog from "components/AlertDialog";

type HomeHeaderProps = {
    onClickSettings: () => void
    onClickCreateEvent: () => void
    user?: User
}
function HomeHeader({onClickSettings, onClickCreateEvent, user}: HomeHeaderProps) {

    return (
        <Stack sx={{ 
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            my: 1
         }}>
            <IconButton aria-label="settings" size='large' onClick={onClickSettings}>
                <SettingsIcon />
            </IconButton>
            <IconButton aria-label="create" size='large' onClick={onClickCreateEvent}>
                <CreateIcon />
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
    const [ openShowDialog, setOpenShowDialog ] = useState(false)
    const [ openEditDialog, setOpenEditDialog ] = useState(false)
    const [ openAlertDialog, setOpenAlertDialog ] = useState(false)
    const [ selectedEvent, setSelecteEvent ] = useState<Event | undefined>()
    const navigate = useNavigate()
    const { user } = useUser()

    const rows = [
        // TODO : debug entry
        new Event("", "Distribution", dayjs(), [
            new Team("1",
                new TeamTemplate("1", "Leclerc sablé / super U arnage", TeamType.RAMASSAGE, "9876 A", 2),
                []
            ),
            new Team("2",
                new TeamTemplate("2", "Carrefour Sud / La Pointe", TeamType.RAMASSAGE, "Sud: 02.43.61.30.96, Pointe: 2312 (v)", 2),
                [
                    new User("a", "Tom", UserType.MEMBRE, new Date(), "tom@lia.fr"),
                    new User("", "Simon", UserType.ADMIN, new Date(), "simon@lia.fr"),
                ]
            ),
            new Team("3",
                new TeamTemplate("3", "U express / Bollé", TeamType.RAMASSAGE, "02.43.34.57.61", 1),
                []
            ),
            new Team("4",
                new TeamTemplate("4", "Leclerc fontenelle drive / Super U bonnétable", TeamType.RAMASSAGE, "Lec: 1234, Sup: 2312 (v)", 2),
                []
            ),
            new Team("5",
                new TeamTemplate("5", "Utile St george du bois", TeamType.RAMASSAGE, "2312 (v)", 1),
                []
            )
        ]),
    ];

    const onCloseDialog = () => {
        setOpenShowDialog(false)
        setOpenEditDialog(false)
        setSelecteEvent(undefined)
    }
    const onEditEvent = (event: Event) => () => {
        setSelecteEvent(event)
        setOpenEditDialog(true)
    }
    const onDeleteEvent = (uuid: string) => () => {
        setSelecteEvent(_getEventFromUuid(uuid))
        setOpenAlertDialog(true)
    }
    const onApplyDeleteEvent = () => {
        setOpenAlertDialog(false)
        // TODO : API call : remove event (selectedEvent)
        // TODO : Refresh list
    }
    const onCreateEvent = () => {
        setSelecteEvent(undefined)
        setOpenEditDialog(true)
    }
    const onOpenSettings = () => {
        navigate('/settings')
    }
    const _getEventFromUuid = (uuid: string) => {
        return rows.find((e: Event) => e.uuid == uuid)
    }

    return (
        <Container>
            <HomeHeader onClickSettings={onOpenSettings} 
                onClickCreateEvent={onCreateEvent} user={user} />
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Événement</TableCell>
                            <TableCell align="right">Montrer</TableCell>
                            <TableCell align="right">Éditer</TableCell>
                            <TableCell align="right">Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((event: Event) => (
                            <TableRow
                            key={event.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <ShowDate dateDayjs={event.date} />
                                </TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" onClick={() => {
                                    setSelecteEvent(event)
                                    setOpenShowDialog(true)
                                    }}>Montrer</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onEditEvent(event)} 
                                        disabled={user?.role != UserType.ADMIN}>Éditer</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onDeleteEvent(event.uuid)} 
                                        disabled={user?.role != UserType.ADMIN}>Supprimer</Button>
                                </TableCell>
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