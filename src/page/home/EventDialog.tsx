import {  Button, Card, CardContent, Container, Dialog, DialogTitle, Paper, Stack, Typography, styled } from "@mui/material";
import Event from "classes/Event";
import Team from "classes/Team";
import { teamTypeToString } from "classes/TeamTemplate";
import User from "classes/User";
import { useUser } from "context/UserContext";

export interface EventDialogProps {
    open: boolean
    event: Event
    onClose: (event: Event) => void;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

type EventTeamProps = {
    team: Team
    user: User | undefined
}
function EventTeam({team, user}: EventTeamProps) {
    const didUserJoined = user && team.members.find((e) => e.id == user?.id) != undefined
    const nbFreePlace = team.template.maxMember - team.members.length

    return (
        <Card key={team.template.title} sx={{ 
            width: 360, 
            m: 1,
            height: 350,
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
                            <Item>{user.username}</Item>
                        )
                    })}
                    </Stack>
                    {!didUserJoined && team.template.maxMember > team.members.length &&
                        <Button sx={{ mt: 2 }} variant="contained">Rejoindre</Button>
                    }
                    {didUserJoined && 
                        <Button sx={{ mt: 2 }} variant="contained">Se désinscrire</Button>
                    }
                    <Typography variant="body1" align="right" sx={{ mt: 1 }}>
                    Place libre(s): {nbFreePlace}
                    </Typography>
                </Card>
            </CardContent>
        </Card>
    )
}

export default function EventDialog(props: EventDialogProps) {
    const { open, event, onClose } = props;
    const { user } = useUser()

    const handleClose = () => {
        onClose(event);
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="xl">
            <DialogTitle>{event.title}</DialogTitle>
            <Container sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}>
                {event.teams.map((team) => {
                    return <EventTeam team={team} user={user} />
                })}
            </Container>
        </Dialog>
    )
}