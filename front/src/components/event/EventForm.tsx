import { Alert, Button, Card, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Snackbar, Stack, TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from "@mui/x-date-pickers";
import Event from "classes/Event";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import { useEffect, useReducer, useState } from "react";
import Team from "classes/Team";
import RemoveIcon from '@mui/icons-material/Delete';
import TeamForm from "../TeamForm";
import Paginated, { PaginationQuery } from "models/Paginated";
import TeamTemplateService from "services/TeamTemplateService";
import { AxiosError } from "axios";
import ErrorNotification from "../ErrorNotification";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";


type EventFormProps = {
    initEvent?: Event
    onSubmit: (e: Event) => void
}

export default function EventForm({ initEvent, onSubmit }: EventFormProps) {
    const [ event, setEvent ] = useState(initEvent ?? new Event())
    const [ newTeamTemplate, setNewTeamTemplate ] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ errorMsg, setErrorMsg ] = useState<string>()
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
    const [ list, setList ] = useState<Paginated<TeamTemplate>>()
    const [ listQuery, setListQuery ] = useState<PaginationQuery>({
        page: 1,
        size: 10
    })
    const network = TeamTemplateService.getInstance();

    useEffect(() => {
        fetchList();
    }, [])

    const fetchList = async () => {
        try {
            setList(await network.getList(listQuery.page, listQuery.size));
        } catch (error) {
            const netError = error as AxiosError
            const errorBody = netError.response?.data as NetErrorBody
            console.error((error as AxiosError).message);
            if (errorBody != undefined) {
                setErrorNet(errorBody)
            } else {
                setErrorNet(NetFailureBody)
            }
        }
    }
    const handleChangeNewTeamTemplate = (event: SelectChangeEvent) => {
        setNewTeamTemplate(Number(event.target.value));
    };
    const handleAddNewTeamTemplate = () => {
        if (list && newTeamTemplate >= 0 && newTeamTemplate < list.data.length) {
            const teamToAdd = list.data[newTeamTemplate]
            if (event.teams.find((t) => teamToAdd.uuid == t.template.uuid) == undefined) {
                // The team don't already exist in the event
                const e = event
                e.teams.push(new Team("", teamToAdd))
                setEvent(e)
                forceUpdate()
            } else {
                setErrorMsg("L'équipe existe déjà dans l'évènement")
            }
        }
    }
    const onSubmitForm = () => {
        onSubmit(event)
    }
    const handleCloseError = () =>  {
        setErrorMsg(undefined)
        setErrorNet(undefined)
    }
    const removeTeamTemplate = (uuid: string) => () => {
        event.teams = event.teams.filter((v) => v.template.uuid != uuid)
        setEvent(event)
        forceUpdate()
    }
    const updateTeam = (index: number) => (team: Team, update: boolean) => {
        if (index >= 0 && index < event.teams.length)
            event.teams[index] = team
        setEvent(event)
        if (update)
            forceUpdate()
    }

    return (
        <Stack sx={{ 
            m: 2, 
            minHeight: 200,
        }} spacing={2}>
            <TextField id="title" label="Titre" variant="standard" defaultValue={event.title} onChange={(e) => {
                event.title = e.target.value
            }} />
            <DatePicker value={event.date} disablePast format="DD/MM/YYYY" onChange={(e) => {
                if (e) event.date = e
            }} />

            <Divider />
            
            {event.teams.length == 0 && 
                <Typography variant="subtitle2" >Aucune équipe dans l'événement</Typography>
            }
            {event.teams.map((team, index) => {
                return (
                    <Card key={team.template.title} sx={{ p: 2, m: 1 }}>
                        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton aria-label="remove" size='small' onClick={removeTeamTemplate(team.template.uuid)}>
                                <RemoveIcon />
                            </IconButton>
                        </Container>
                        <TeamForm team={team} setTeam={updateTeam(index)} />
                    </Card>
                )
            })}
            <Divider />
            <FormControl variant="standard" sx={{ m: 1 }}>
                <InputLabel id="new-team-select-label">Ajouter une équipe:</InputLabel>
                <Select
                    labelId="new-team-select-label"
                    id="new-team-select"
                    value={newTeamTemplate.toString()}
                    onChange={handleChangeNewTeamTemplate}
                >
                    {list?.data.map((template, index) => {
                        return (                   
                            <MenuItem key={template.title} value={index}>{template.title}</MenuItem>
                        )
                    })}
                </Select>
                <Button onClick={handleAddNewTeamTemplate} sx={{ mt: 2 }}>Ajouter</Button>
            </FormControl>
            <Divider />
            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 2
            }}>
                <Button variant="contained" sx={{
                    width: 150,
                }} onClick={onSubmitForm}>
                Enregistrer
                </Button>
            </Container>
            {/* Error notification: */}
            <ErrorNotification show={(errorMsg != undefined || errorNet != undefined)} 
                onClose={handleCloseError} 
                message={errorMsg} 
                netError={errorNet}
            />
        </Stack>

    )
}