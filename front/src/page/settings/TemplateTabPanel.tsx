import { Button, Container, IconButton } from "@mui/material";
import { CustomTabPanel, TabPanelProps } from "./Settings";
import CreateIcon from '@mui/icons-material/Add'
import EditDialog from "components/EditDialog";
import { useReducer, useState } from "react";
import TeamTemplate, { TeamType } from "classes/TeamTemplate";
import TeamTemplateForm from "components/TeamTemplateForm";
import AlertDialog from "components/AlertDialog";
import TeamTemplateTable from "components/TeamTemplateTable";

export default function TemplateTabPanel({ tabIndex }: TabPanelProps)
{
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ selected, setSelected ] = useState<TeamTemplate | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const teamTemplateList = [ // TODO: DEBUG DATA
        new TeamTemplate("1", "Leclerc sablé / super U arnage", TeamType.RAMASSAGE, "9876 A", 2),
        new TeamTemplate("2", "Carrefour Sud / La Pointe", TeamType.RAMASSAGE, "Sud: 02.43.61.30.96, Pointe: 2312 (v)", 2),
        new TeamTemplate("3", "U express / Bollé", TeamType.RAMASSAGE, "02.43.34.57.61", 1),
        new TeamTemplate("4", "Leclerc fontenelle drive / Super U bonnétable", TeamType.RAMASSAGE, "Lec: 1234, Sup: 2312 (v)", 2),
        new TeamTemplate("5", "Utile St george du bois", TeamType.RAMASSAGE, "2312 (v)", 1),
    ]

    const onCreate = () => {
        setSelected(undefined)
        setShowEditDialog(true)
    }
    const onEdit = (uuid: string) => {
        setSelected(_getFromUuid(uuid))
        setShowEditDialog(true)
    }
    const onRemove = (uuid: string) => {
        setSelected(_getFromUuid(uuid))
        setShowAlertDialog(true)
    }
    const onEditSubmit = () => {
        setShowEditDialog(false)
        // TODO : API call => selected
    }
    const onRemoveApply = () => {
        setShowAlertDialog(false)
        // TODO : API call 
    }
    const _getFromUuid = (uuid: string) => {
        return teamTemplateList.find((t: TeamTemplate) => t.uuid == uuid)
    }

    return (
        <CustomTabPanel value={tabIndex} index={1}>
            <IconButton size='medium' onClick={onCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <TeamTemplateTable templateList={teamTemplateList} onEdit={onEdit} onRemove={onRemove} />
            <EditDialog
                open={showEditDialog} 
                onClose={() => setShowEditDialog(false)} 
                title="Edition d'un modèle d'équipe"
                maxWidth="xs">
                <Container sx={{
                    py: 2
                }}>
                    <TeamTemplateForm setTemplate={(t: TeamTemplate) => {
                        setSelected(t)
                        forceUpdate()
                    }} template={selected} />
                    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={onEditSubmit}>Envoyer</Button>
                    </Container>
                </Container>
            </EditDialog>
            <AlertDialog 
                open={showAlertDialog} 
                onClose={() => setShowAlertDialog(false)} 
                onAgree={onRemoveApply}
                question="Confirmer la suppression définitive ?" />
        </CustomTabPanel>
    )
}