import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import TeamTemplate, { teamTypeToString } from "classes/TeamTemplate"

type EventTeamTableRowProps = {
    template: TeamTemplate
    onEdit: (uuid: string) => void
    onRemove: (uuid: string) => void   
}
function TeamTemplateTableRow({ template, onEdit, onRemove }: EventTeamTableRowProps)
{
    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{template.title}</TableCell>
            <TableCell>{teamTypeToString(template.type)}</TableCell>
            <TableCell>{template.note}</TableCell>
            <TableCell>{template.maxMember}</TableCell>
            <TableCell align='right'>
               <Button variant="outlined" onClick={() => onEdit(template.uuid)}>Éditer</Button>
            </TableCell>
            <TableCell align='right'>
                <Button variant="outlined" onClick={() => onRemove(template.uuid)}>Supprimer</Button>
            </TableCell>
        </TableRow>
    )
}

export type TeamTemplateTableProps = {
    templateList?: TeamTemplate[]
    onEdit: (uuid: string) => void
    onRemove: (uuid: string) => void
}
export default function TeamTemplateTable({ templateList, onEdit, onRemove }: TeamTemplateTableProps)
{
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Memo</TableCell>
                        <TableCell>Nombre de places</TableCell>
                        <TableCell align='right'>Editer</TableCell>
                        <TableCell align='right'>Supprimer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {templateList?.map((template) => (
                    <TeamTemplateTableRow key={template.uuid} template={template} 
                        onEdit={onEdit} onRemove={onRemove} />
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}