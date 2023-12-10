import { Button, Container, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import User from "classes/User";
import ShowDate from "components/ShowDate";
import { useState } from "react";
import EventShowDialog from "./EventShowDialog";
import EventEditDialog from './EventEditDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";

type HomeHeaderProps = {
    onClickSettings: () => void
    onClickCreateEvent: () => void
}
function HomeHeader({onClickSettings, onClickCreateEvent}: HomeHeaderProps) {
    return (
        <Stack sx={{ 
            display: 'flex',
            flexDirection: 'row-reverse',
            my: 1
         }}>
            <IconButton aria-label="settings" size='large' onClick={onClickSettings}>
                <SettingsIcon />
            </IconButton>
            <IconButton aria-label="create" size='large' onClick={onClickCreateEvent}>
                <CreateIcon />
            </IconButton>
        </Stack>
    )
}

export default function HomePage() {
    const [ openShowDialog, setOpenShowDialog ] = useState(false)
    const [ openEditDialog, setOpenEditDialog ] = useState(false)
    const [ selectedEvent, setSelecteEvent ] = useState(-1)

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
                    new User("a", "Tom", "USER", new Date(), "tom@lia.fr"),
                    new User("", "Simon", "ADMIN", new Date(), "simon@lia.fr"),
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
        setSelecteEvent(-1)
    }
    const onEditEvent = (index: number) => () => {
        setSelecteEvent(index)
        setOpenEditDialog(true)
    }
    const onDeleteEvent = (uuid: string) => () => {
        // Send remove to API
        // Refresh list
        // TODO
    }
    const onCreateEvent = () => {
        setSelecteEvent(-1)
        setOpenEditDialog(true)
    }
    const onOpenSettings = () => {
        // TODO: settings
    }

    return (
        <Container>
            <HomeHeader onClickSettings={onOpenSettings} onClickCreateEvent={onCreateEvent} />
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
                        {rows.map((row: Event, index: number) => (
                            <TableRow
                            key={row.uuid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <ShowDate date={row.date} />
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" onClick={() => {
                                    setSelecteEvent(index)
                                    setOpenShowDialog(true)
                                    }}>Monter</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onEditEvent(index)}>Éditer</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={onDeleteEvent(row.uuid)} disabled>Supprimer</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination count={5} color="primary" sx={{ my: 2 }} disabled />
                <EventShowDialog open={openShowDialog} event={rows.at(selectedEvent)} onClose={onCloseDialog} ></EventShowDialog>
                <EventEditDialog open={openEditDialog} onClose={onCloseDialog} toEdit={rows.at(selectedEvent)} />
            </TableContainer>
        </Container>
    )
}