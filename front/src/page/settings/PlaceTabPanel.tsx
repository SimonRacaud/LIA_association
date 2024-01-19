import { CustomTabPanel } from "components/CustomTabPanel";
import { TabPanelProps } from "./Settings";
import { Box, Button, Container, IconButton, Pagination } from "@mui/material";

import CreateIcon from '@mui/icons-material/Add'
import EditDialog from "components/EditDialog";
import AlertDialog from "components/AlertDialog";
import ErrorNotification from "components/ErrorNotification";
import { useEffect, useReducer, useState } from "react";
import PlaceService from "services/PlaceService";
import Place from "classes/Place";
import Paginated, { PaginationQuery } from "models/Paginated";
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse";
import { AxiosError } from "axios";
import PlaceTable from "components/place/PlaceTable";
import PlaceForm from "components/place/PlaceForm";

export default function PlaceTabPanel({ tabIndex }: TabPanelProps)
{
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ createMode, setCreateMode ] = useState(false)
    const [ selected, setSelected ] = useState<Place | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ list, setList ] = useState<Paginated<Place>>()
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
    const [listQuery, setListQuery ] = useState<PaginationQuery>({
        page: 1,
        size: 10
    })
    const network = PlaceService.getInstance();

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
        return list?.data.find((d: Place) => d.uuid == uuid)
    }
    const onPageChange = (e: any, page: number) => {
        setListQuery({
            ...listQuery,
            page: page
        })
        fetchList(page)
    }

    return (
        <CustomTabPanel value={tabIndex} index={2}>
            <IconButton size='medium' onClick={onCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <PlaceTable list={list?.data} onEdit={onEdit} onRemove={onRemove} />
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
                    <PlaceForm setPlace={(d: Place) => {
                        setSelected(d)
                        forceUpdate()
                    }} place={selected} />
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