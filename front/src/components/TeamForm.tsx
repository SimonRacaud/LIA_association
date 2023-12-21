import { Box, Card, Stack, Typography } from "@mui/material";
import TeamTemplateForm from "./TeamTemplateForm";
import Team from "classes/Team";
import TeamTemplate from "classes/TeamTemplate";
import UserTable from "./UserTable";
import TeamService from "services/TeamService";
import { AxiosError } from "axios";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import { useState } from "react";
import ErrorNotification from "./ErrorNotification";

type TeamFormProps = {
    team: Team
    setTeam: (t: Team, update: boolean) => void
}

export default function TeamForm({ team, setTeam }: TeamFormProps)
{
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()

    const updateTeamTemplate = (template: TeamTemplate, update: boolean) => {
        team.template = template
        setTeam(team, update)
        // TODO : API CALL ?
    }
    const onRemoveUser = async (uuid: string) => {
        try {
            // API Update
            await TeamService.memberUnsubscribe(team.uuid, uuid)
            // Remove 'user" from team
            team.members = team.members.filter((user) => user.id != uuid)
            setTeam(team, true)
        } catch(error) {
            const errorNetwork = error as AxiosError
            const errorBody = errorNetwork.response?.data as NetErrorBody
            console.error(errorNetwork.message)
            if (errorBody) {
                setErrorNet(NetFailureBody)
            } else {
                setErrorNet(errorBody)
            }
        }
    }

    return (
        <Box>
            <Stack spacing={2}>
                {/* Template */}
                <TeamTemplateForm template={team.template} setTemplate={updateTeamTemplate} lock={true} />
                {/* Members */}
                {team.members.length > 0 &&
                <Card sx={{ m: 1, p: 0 }}>
                    <Typography sx={{ my: 1, ml: 2 }}>Membres inscrits:</Typography>
                    <UserTable userList={team.members} onRemoveUser={onRemoveUser} short={true} />
                </Card>
                }
            </Stack>
            <ErrorNotification show={errorNet != undefined}
                onClose={() => setErrorNet(undefined)}
                netError={errorNet}
            />
        </Box>
    )
}