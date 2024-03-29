import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import Place from "classes/Place";
import TeamTemplate, { TeamType, teamTypeOptions, teamTypeToString } from "classes/TeamTemplate";
import SelectPlaceForm from "components/SelectPlaceForm";
import NetErrorBody from "models/ErrorResponse";
import { ChangeEvent } from "react";

type TeamTemplateFormProps = {
    template?: TeamTemplate // undefined if we want to create a new one
    setTemplate: (t: TeamTemplate, update: boolean) => void
    lock?: boolean,
    setErrorNet: (e: NetErrorBody) => void
}

export default function TeamTemplateForm({template, setTemplate, lock, setErrorNet}: TeamTemplateFormProps)
{
    if (!template) {
        template = new TeamTemplate("", "", TeamType.RAMASSAGE, "", 0)
    }

    const handleChangeTemplateType = (event: SelectChangeEvent) => {
        const value = event.target.value

        if (template) {
            template.type = value as TeamType
            setTemplate(template, true)
        }
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (template) {
            template.title = e.target.value
            setTemplate(template, false)
        }
    }
    const handleMemoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (template) {
            template.note = e.target.value
            setTemplate(template, false)
        }
    }
    const handleMaxMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (template) {
            template.maxMember = Number(e.target.value)
            if (template.maxMember == 0)
                template.maxMember = 0 // Minimum is 0
            e.target.value = template.maxMember.toString()
            setTemplate(template, true)
        }
    }

    return (
        <Stack spacing={2}>
            <TextField label="Titre" variant="standard" defaultValue={template.title} 
                onChange={handleTitleChange} type='text' InputLabelProps={{ shrink: true }} disabled={lock} />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="team-type-label">Type</InputLabel>
                <Select
                    labelId="team-type-label"
                    id="team-type-select"
                    value={template.type}
                    onChange={handleChangeTemplateType}
                    disabled={lock}
                >
                    {teamTypeOptions.map((option: TeamType) => {
                        return (
                            <MenuItem key={option} value={option}>{teamTypeToString(option)}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <SelectPlaceForm
                place={template.place}
                setPlace={(p: Place) => {
                    setTemplate({
                        ...template,
                        place: p
                    } as TeamTemplate, true)
                }}
                setErrorNet={setErrorNet}
                disable={lock}
            />
            <TextField label="Memo" variant="standard" defaultValue={template.note} 
                onChange={handleMemoChange} InputLabelProps={{ shrink: true }}
                disabled={lock} />
            <TextField label="Nombre de personnes" variant="standard" 
                value={template.maxMember} type="number"
                onChange={handleMaxMemberChange}
                disabled={lock} />
        </Stack>
    )
}