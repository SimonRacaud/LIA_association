import { Box, Button, Container, IconButton, Pagination } from "@mui/material";
import { TabPanelProps } from "./Settings";
import CreateIcon from '@mui/icons-material/Add'
import EditDialog from "components/EditDialog";
import { useEffect, useReducer, useState } from "react";
import TeamTemplate from "classes/TeamTemplate";
import TeamTemplateForm from "components/TeamTemplateForm";
import AlertDialog from "components/AlertDialog";
import TeamTemplateTable from "components/TeamTemplateTable";
import TeamTemplateService from "services/TeamTemplateService";
import Paginated, { PaginationQuery } from "models/Paginated";
import { AxiosError } from "axios";
import ErrorNotification from "components/ErrorNotification";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import { CustomTabPanel } from "components/CustomTabPanel";

export default function TemplateTabPanel({ tabIndex }: TabPanelProps)
{
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ createMode, setCreateMode ] = useState(false)
    const [ selected, setSelected ] = useState<TeamTemplate | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ list, setList ] = useState<Paginated<TeamTemplate>>()
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
    const [listQuery, setListQuery ] = useState<PaginationQuery>({
        page: 1,
        size: 10
    })
    const network = TeamTemplateService.getInstance();

    useEffect(() => {
        fetchList()
    }, [])
    const handleNetError = (error: AxiosError) => {
        const errorBody = error.response?.data as NetErrorBody | undefined
        console.error(error.message)
        if (errorBody == undefined) {
            setErrorNet(NetFailureBody)
        } else {
            setErrorNet(errorBody)
        }
    }
    const fetchList = async (page?: number) => {
        try {
            setList(await network.getList(page ?? listQuery.page, listQuery.size))
        } catch (error: any) {
            handleNetError(error)
        }
    }
    const onCreate = () => {
        setCreateMode(true)
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
    const onEditDialogSubmit = async () => {
        // API call
        if (selected) {
            try {
                if (createMode) {
                    await network.create(selected)
                } else {
                    await network.update(selected)
                }
                setShowEditDialog(false)
                setCreateMode(false)
                fetchList() // Refresh list
            } catch (error: any) {
                handleNetError(error)
            }
        }
    }
    const onCloseEditDialog = () => {
        setShowEditDialog(false)
        setCreateMode(false)
    }
    const onRemoveApply = async () => {
        setShowAlertDialog(false)
        // API call 
        if (selected) {
            try {
                await network.remove(selected.uuid)
                fetchList() // Refresh list
            } catch (error: any) {
                handleNetError(error)
            }
        }
    }
    const _getFromUuid = (uuid: string) => {
        return list?.data.find((t: TeamTemplate) => t.uuid == uuid)
    }
    const onPageChange = (e: any, page: number) => {
        setListQuery({
            ...listQuery,
            page: page
        })
        fetchList(page)
    }

    return (
        <CustomTabPanel value={tabIndex} index={1}>
            <IconButton size='medium' onClick={onCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <TeamTemplateTable templateList={list?.data} onEdit={onEdit} onRemove={onRemove} />
            <Box
                display="flex"
                justifyContent="center">
                <Pagination count={list?.max} color="primary" sx={{ my: 2 }} onChange={onPageChange} />
            </Box>
            <EditDialog
                open={showEditDialog} 
                onClose={onCloseEditDialog} 
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
                        <Button variant="contained" sx={{ mt: 2 }} onClick={onEditDialogSubmit}>Envoyer</Button>
                    </Container>
                </Container>
            </EditDialog>
            <AlertDialog 
                open={showAlertDialog} 
                onClose={() => setShowAlertDialog(false)} 
                onAgree={onRemoveApply}
                question="Confirmer la suppression définitive ?" />
            <ErrorNotification show={errorNet != undefined}
                onClose={() => setErrorNet(undefined)}
                netError={errorNet}
            />
        </CustomTabPanel>
    )
}