import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import TeamTemplate, { teamTypeOptions, teamTypeToString } from "classes/TeamTemplate";
import { ChangeEvent } from "react";

type TeamTemplateFormProps = {
    template: TeamTemplate
    setTemplate: (t: TeamTemplate, update: boolean) => void
}

export default function TeamTemplateForm({template, setTemplate}: TeamTemplateFormProps)
{
    const handleChangeTemplateType = (event: SelectChangeEvent) => {
        const value = event.target.value

        template.type = teamTypeOptions[Number(value)]
        setTemplate(template, true)
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        template.title = e.target.value
        setTemplate(template, false)
    }
    const handleMemoChange = (e: ChangeEvent<HTMLInputElement>) => {
        template.note = e.target.value
        setTemplate(template, false)
    }
    const handleMaxMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
        template.maxMember = Number(e.target.value)
        if (template.maxMember == 0)
            template.maxMember = 1 // Minimum is 1
        e.target.value = template.maxMember.toString()
        setTemplate(template, true)
    }

    return (
        <Stack spacing={2}>
            <TextField label="Titre" variant="standard" defaultValue={template.title} 
                onChange={handleTitleChange} type='text' InputLabelProps={{ shrink: true }} />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="team-type-label">Type</InputLabel>
                <Select
                    labelId="team-type-label"
                    id="team-type-select"
                    value={template.type.toString()}
                    onChange={handleChangeTemplateType}
                >
                    {teamTypeOptions.map((option) => {
                        return (                   
                            <MenuItem key={option} value={option}>{teamTypeToString(option)}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <TextField label="Memo" variant="standard" defaultValue={template.note} 
                onChange={handleMemoChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Nombre de personnes" variant="standard" 
                value={template.maxMember} type="number"
                onChange={handleMaxMemberChange} />
        </Stack>
    )
}