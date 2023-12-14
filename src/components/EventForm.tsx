import { Alert, Button, Card, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Snackbar, Stack, TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from "@mui/x-date-pickers";
import Event from "classes/Event";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import { useEffect, useReducer, useState } from "react";
import Team from "classes/Team";
import RemoveIcon from '@mui/icons-material/Delete';
import TeamForm from "./TeamForm";


type EventFormProps = {
    initEvent?: Event
    onSubmit: (e: Event) => void
}

export default function EventForm({ initEvent, onSubmit }: EventFormProps) {
    const [ event, setEvent ] = useState(initEvent ?? new Event())
    const [ newTeamTemplate, setNewTeamTemplate ] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ showError, setShowError ] = useState(false)
    const [ error, setError ] = useState("")

    const teamTemplateList = [ // DEBUG DATA
        new TeamTemplate("1", "Leclerc sablé / super U arnage", TeamType.RAMASSAGE, "9876 A", 2),
        new TeamTemplate("2", "Carrefour Sud / La Pointe", TeamType.RAMASSAGE, "Sud: 02.43.61.30.96, Pointe: 2312 (v)", 2),
        new TeamTemplate("3", "U express / Bollé", TeamType.RAMASSAGE, "02.43.34.57.61", 1),
        new TeamTemplate("4", "Leclerc fontenelle drive / Super U bonnétable", TeamType.RAMASSAGE, "Lec: 1234, Sup: 2312 (v)", 2),
        new TeamTemplate("5", "Utile St george du bois", TeamType.RAMASSAGE, "2312 (v)", 1),
    ]
    useEffect(() => {
        // TODO: Fetch team template list
    })


    const handleChangeNewTeamTemplate = (event: SelectChangeEvent) => {
        setNewTeamTemplate(Number(event.target.value));
    };
    const handleAddNewTeamTemplate = () => {
        if (newTeamTemplate >= 0 && newTeamTemplate < teamTemplateList.length) {
            const teamToAdd = teamTemplateList[newTeamTemplate]
            if (event.teams.find((t) => teamToAdd.uuid == t.template.uuid) == undefined) {
                // The team don't already exist in the event
                const e = event
                e.teams.push(new Team("", teamToAdd))
                setEvent(e)
                forceUpdate()
            } else {
                setError("L'équipe existe déjà dans l'évènement")
                setShowError(true)
            }
        }
    }
    const onSubmitForm = () => {
        onSubmit(event)
    }
    const handleCloseError = () =>  {
        setShowError(false)
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
            <DatePicker value={event.date} disablePast format="DD/MM/YYYY" />

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
                    {teamTemplateList.map((template, index) => {
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
            <Snackbar open={showError} autoHideDuration={3000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                {error}
                </Alert>
            </Snackbar>
        </Stack>

    )
}