import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import User from "classes/User";
import ShowDate from "components/ShowDate";
import { useState } from "react";
import EventDialog from "./EventDialog";
import SettingsIcon from '@mui/icons-material/Settings';

function HomeHeader() {
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'row-reverse',
            my: 1
         }}>
            <IconButton aria-label="settings" size='large'>
                <SettingsIcon />
            </IconButton>
        </Box>
    )
}

export default function HomePage() {
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ selectedEvent, setSelecteEvent ] = useState(0)

    const rows = [
        // TODO : debug entry
        new Event("Distribution", new Date(), [
            new Team(
                new TeamTemplate("Leclerc sablé / super U arnage", TeamType.RAMASSAGE, "9876 A", 2),
                []
            ),
            new Team(
                new TeamTemplate("Carrefour Sud / La Pointe", TeamType.RAMASSAGE, "Sud: 02.43.61.30.96, Pointe: 2312 (v)", 2),
                [
                    new User("a", "Tom", "USER", new Date(), "tom@lia.fr"),
                    new User("", "Simon", "ADMIN", new Date(), "simon@lia.fr"),
                ]
            ),
            new Team(
                new TeamTemplate("U express / Bollé", TeamType.RAMASSAGE, "02.43.34.57.61", 1),
                []
            ),
            new Team(
                new TeamTemplate("Leclerc fontenelle drive / Super U bonnétable", TeamType.RAMASSAGE, "Lec: 1234, Sup: 2312 (v)", 2),
                []
            ),
            new Team(
                new TeamTemplate("Utile St george du bois", TeamType.RAMASSAGE, "2312 (v)", 1),
                []
            )
        ]),
    ];

    const onCloseDialog = (event: Event) => {
        // TODO update event
        setOpenDialog(false)
    }


    return (
        <Container>
            <HomeHeader />
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
                            key={row.title}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <ShowDate date={row.date} />
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" onClick={() => {
                                    setSelecteEvent(index)
                                    setOpenDialog(true)
                                    }}>Monter</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" disabled>Éditer</Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" disabled>Supprimer</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <EventDialog open={openDialog} event={rows[selectedEvent]} onClose={onCloseDialog} ></EventDialog>
            </TableContainer>
        </Container>
    )
}