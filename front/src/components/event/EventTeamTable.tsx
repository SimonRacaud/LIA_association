import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import Event from "classes/Event"
import Team from "classes/Team"
import { teamTypeToString } from "classes/TeamTemplate"
import User from "classes/User"
import { Item } from "./EventTeamCardList"


type EventTeamTableRowProps = {
    team: Team
    user: User
    onSubscribeTeam: (t: Team) => void
    onUnsubscribeTeam: (t: Team) => void
}
function EventTeamTableRow({team, user, onSubscribeTeam, onUnsubscribeTeam}: EventTeamTableRowProps)
{
    const didUserJoined = user && team.members.find((e) => e.id == user?.id) != undefined
    const nbFreePlace = team.template.maxMember - team.members.length

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{team.template.title}</TableCell>
            <TableCell>{nbFreePlace}</TableCell>
            <TableCell>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {team.members.map((user) => {
                        return (
                            <Item key={user.id}>{user.username}</Item>
                        )
                    })}
                </Stack>
            </TableCell>
            <TableCell>{team.template.note}</TableCell>
            <TableCell>
            {!didUserJoined && team.template.maxMember > team.members.length &&
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => onSubscribeTeam(team)}>Rejoindre</Button>
            }
            {didUserJoined && 
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => onUnsubscribeTeam(team)}>Se désinscrire</Button>
            }
            </TableCell>
        </TableRow>
    )
}


type EventTeamTableProps = {
    teams: Team[]
    user: User
    onSubscribeTeam: (t: Team) => void
    onUnsubscribeTeam: (t: Team) => void
}
export default function EventTeamTable({teams, user, onSubscribeTeam, onUnsubscribeTeam}: EventTeamTableProps)
{

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Places disponibles</TableCell>
                        <TableCell>Participants</TableCell>
                        <TableCell>Memo</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {teams.map((team: Team) => (
                    <EventTeamTableRow key={team.uuid} team={team} user={user} 
                        onSubscribeTeam={onSubscribeTeam} 
                        onUnsubscribeTeam={onUnsubscribeTeam} />
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}