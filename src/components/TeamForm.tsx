import { Card, Stack, Typography } from "@mui/material";
import TeamTemplateForm from "./TeamTemplateForm";
import Team from "classes/Team";
import TeamTemplate from "classes/TeamTemplate";
import UserTable from "./UserTable";

type TeamFormProps = {
    team: Team
    setTeam: (t: Team, update: boolean) => void
}

export default function TeamForm({ team, setTeam }: TeamFormProps)
{
    const updateTeamTemplate = (template: TeamTemplate, update: boolean) => {
        team.template = template
        setTeam(team, update)
    }
    const onRemoveUser = (uuid: string) => {
        team.members = team.members.filter((user) => user.id != uuid)
        setTeam(team, true)
    }

    return (
        <Stack spacing={2}>
            {/* Template */}
            <TeamTemplateForm template={team.template} setTemplate={updateTeamTemplate} />
            {/* Members */}
            {team.members.length > 0 &&
            <Card sx={{ m: 1, p: 1 }}>
                <Typography sx={{ my: 1 }}>Membres inscrits:</Typography>
                <UserTable userList={team.members} onRemoveUser={onRemoveUser} />
            </Card>
            }
        </Stack>
    )
}