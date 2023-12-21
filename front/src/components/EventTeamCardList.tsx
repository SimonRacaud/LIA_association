import { Button, Card, CardContent, Container, Paper, Stack, Typography, styled } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import { teamTypeToString } from "classes/TeamTemplate";
import User from "classes/User";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

type EventTeamProps = {
    team: Team
    user: User | undefined
    onSubscribeTeam: (t: Team) => void
    onUnsubscribeTeam: (t: Team) => void
}
function EventTeam({team, user, onSubscribeTeam, onUnsubscribeTeam}: EventTeamProps) {
    const didUserJoined = user && team.members.find((e) => e.id == user?.id) != undefined
    const nbFreePlace = team.template.maxMember - team.members.length

    return (
        <Card key={team.template.title} sx={{ 
            width: 360, 
            m: 1,
            overflowY: 'auto',
            }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 1,
                m: 0,
            }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ mb: 2, minHeight: 60 }} >
                   {team.template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                    {teamTypeToString(team.template.type)}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }} component="div">
                    Notes: {team.template.note}
                </Typography>
                <Card sx={{ p: 2}} component="div">
                    <Typography sx={{ typography: 'subtitle2', mb: 1 }}>Inscrits:</Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {team.members.map((user) => {
                        return (
                            <Item key={user.id}>{user.username}</Item>
                        )
                    })}
                    </Stack>
                    {!didUserJoined && team.template.maxMember > team.members.length &&
                        <Button sx={{ mt: 2 }} variant="contained" onClick={() => onSubscribeTeam(team)}>Rejoindre</Button>
                    }
                    {didUserJoined && 
                        <Button sx={{ mt: 2 }} variant="contained" onClick={() => onUnsubscribeTeam(team)}>Se désinscrire</Button>
                    }
                    <Typography variant="body1" align="right" sx={{ mt: 1 }}>
                    Place libre(s): {nbFreePlace}
                    </Typography>
                </Card>
            </CardContent>
        </Card>
    )
}

type EventTeamCardListProps = {
    event: Event
    user: User
    onSubscribeTeam: (t: Team) => void
    onUnsubscribeTeam: (t: Team) => void
}
export default function EventTeamCardList({ event, user, onSubscribeTeam, onUnsubscribeTeam }: EventTeamCardListProps)
{

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        }}>
            {event?.teams.map((team) => {
                return <EventTeam key={team.uuid} team={team} user={user} onSubscribeTeam={onSubscribeTeam} onUnsubscribeTeam={onUnsubscribeTeam} />
            })}
        </Container>
    )
}