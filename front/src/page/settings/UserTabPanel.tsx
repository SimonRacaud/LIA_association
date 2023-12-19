import UserTable from "components/UserTable"
import { CustomTabPanel, TabPanelProps } from "./Settings"
import User from "classes/User"
import { Button, Container, IconButton } from "@mui/material"
import CreateIcon from '@mui/icons-material/Add'
import { useNavigate } from "react-router-dom"
import EditDialog from "components/EditDialog"
import { useEffect, useReducer, useState } from "react"
import UserForm from "components/UserForm"
import AlertDialog from "components/AlertDialog"
import UserService from "services/UserService"
import Paginated from "models/Paginated"

export default function UserTabPanel({ tabIndex }: TabPanelProps)
{
    const navigate = useNavigate()
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState<User | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ page, setPage ] = useState(1)
    const [ listSize, setListSize ] = useState(5)
    const [ list, setList ] = useState<Paginated<User>>()

    useEffect(() => {
        loadUserList();
    }, [])

    const loadUserList = () => {
        UserService.getUsers(page, listSize)
        .then((paginated) => {
            setList(paginated)
        })
        .catch((error) => {
            console.error("Network: ", error.message)
            setList(undefined)
        })
    }
    const onUserEdit = (uuid: string) => {
        // Open user edit dialog
        setSelectedUser(_getUserFromUuid(uuid))
        setShowEditDialog(true)
    }
    const onUserEditSubmit = () => {
        if (selectedUser) {
            // API call
            if (selectedUser.id != '') { 
                // New user created:
                UserService.updateUser(selectedUser)
                .catch((error) => {
                    console.error("Network: ", error.message)
                    alert("Echec de la mise à jour de l'utilisateur")
                })
            } else {
                // Editing existing user:
                UserService.createUser(selectedUser)
                .catch((error) => {
                    console.error("Network: ", error.message)
                    alert("Echec de la création de l'utilisateur")
                })
                .then(() => {
                    loadUserList() // refresh list
                })
            }
        }
        setShowEditDialog(false)
    }
    const onCloseUserEditDialog = () => {
        setShowEditDialog(false)
    }
    const onUserRemove = (uuid: string) => {
        setSelectedUser(_getUserFromUuid(uuid))
        setShowAlertDialog(true)
    }
    const applyUserRemoval = () => {
        // Send remove Request to API
        if (selectedUser) {
            UserService.removeUser(selectedUser.id)
            .catch((error) => {
                console.error("Network: ", error.message)
                alert("Echec de la suppression de l'utilisateur")
            })
            .then(() => {
                // Refresh user list
                loadUserList();
            })
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

    return (
        <CustomTabPanel value={tabIndex} index={0}>
            <IconButton size='medium' onClick={onUserCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <UserTable userList={list?.data} onEditUser={onUserEdit} onRemoveUser={onUserRemove} />
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
        </CustomTabPanel>
    )
}