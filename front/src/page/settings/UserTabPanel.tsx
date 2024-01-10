import UserTable from "components/UserTable"
import { TabPanelProps } from "./Settings"
import User from "classes/User"
import { Box, Button, Container, IconButton, Pagination } from "@mui/material"
import CreateIcon from '@mui/icons-material/Add'
import EditDialog from "components/EditDialog"
import { useEffect, useReducer, useState } from "react"
import UserForm from "components/UserForm"
import AlertDialog from "components/AlertDialog"
import UserService from "services/UserService"
import Paginated from "models/Paginated"
import ErrorNotification from "components/ErrorNotification"
import NetErrorBody, { NetFailureBody } from "models/ErrorResponse"
import { AxiosError } from "axios"
import { CustomTabPanel } from "components/CustomTabPanel"

export default function UserTabPanel({ tabIndex }: TabPanelProps)
{
    const [ errorNet, setErrorNet ] = useState<NetErrorBody>()
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState<User | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ page, setPage ] = useState(1)
    const [ listSize, setListSize ] = useState(10)
    const [ list, setList ] = useState<Paginated<User>>()

    useEffect(() => {
        loadUserList();
    }, [])

    const handleNetError = (error: AxiosError) => {
        const errorBody = error?.response?.data as NetErrorBody
        console.error(error?.message)
        if (errorBody) {
            setErrorNet(NetFailureBody)
        } else {
            setErrorNet(errorBody)
        }
    }
    const loadUserList = (p?: number) => {
        UserService.getUsers(p ?? page, listSize)
        .then((paginated) => {
            setList(paginated)
        })
        .catch((error: any) => {
            handleNetError(error)
            setList(undefined)
        })
    }
    const onUserEdit = (uuid: string) => {
        // Open user edit dialog
        setSelectedUser(_getUserFromUuid(uuid))
        setShowEditDialog(true)
    }
    
    const onUserEditSubmit = async () => {
        if (selectedUser) {
            // API call
            if (selectedUser.id != '') { 
                try {
                    // New user created:
                    await UserService.updateUser(selectedUser)
                } catch(error: any) {
                    handleNetError(error)
                }
            } else {
                try {
                    // Editing existing user:
                    await UserService.createUser(selectedUser)
                    loadUserList() // refresh list
                } catch(error: any) {
                    handleNetError(error)
                }
            }
            setShowEditDialog(false)
        }
    }
    const onCloseUserEditDialog = () => {
        setShowEditDialog(false)
    }
    const onUserRemove = (uuid: string) => {
        setSelectedUser(_getUserFromUuid(uuid))
        setShowAlertDialog(true)
    }
    const applyUserRemoval = async () => {
        // Send remove Request to API
        if (selectedUser) {
            try {
                await UserService.removeUser(selectedUser.id)
                // Refresh user list
                loadUserList();
            } catch(error: any) {
                handleNetError(error)
            }
        }
    }
    const onUserCreate = () => {
        // Open user create form dialog
        setSelectedUser(undefined)
        setShowEditDialog(true)
    }
    const _getUserFromUuid = (uuid: string) => {
        return list?.data.find((user: User) => user.id == uuid)
    }
    const onChangePage = (e: any, page: number) => {
        setPage(page)
        loadUserList(page)
    }

    return (
        <CustomTabPanel value={tabIndex} index={0}>
            <IconButton size='medium' onClick={onUserCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <UserTable userList={list?.data} onEditUser={onUserEdit} onRemoveUser={onUserRemove} />
            <Box
                display="flex"
                justifyContent="center">
                <Pagination count={list?.max} page={page} onChange={onChangePage} color="primary" sx={{ my: 2 }} />
            </Box>
            <EditDialog 
                open={showEditDialog} 
                onClose={onCloseUserEditDialog} 
                title="Edition d'un utilisateur"
                maxWidth="xs">
                <Container sx={{
                    py: 2
                }}>
                    <UserForm setUser={(u: User) => {
                        setSelectedUser(u)
                        forceUpdate()
                    }} user={selectedUser} />
                    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={onUserEditSubmit}>Envoyer</Button>
                    </Container>
                </Container>
            </EditDialog>
            <AlertDialog 
                open={showAlertDialog} 
                onClose={() => setShowAlertDialog(false)} 
                onAgree={() => {
                    setShowAlertDialog(false)
                    applyUserRemoval()
                }}
                question="Confirmer la suppression définitive ?" />
            <ErrorNotification show={errorNet != undefined}
                onClose={() => setErrorNet(undefined)}
                netError={errorNet}
            />
        </CustomTabPanel>
    )
}