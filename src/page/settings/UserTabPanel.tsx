import UserTable from "components/UserTable"
import { CustomTabPanel, TabPanelProps } from "./Settings"
import User, { UserType } from "classes/User"
import { Button, Container, IconButton } from "@mui/material"
import CreateIcon from '@mui/icons-material/Add'
import { useNavigate } from "react-router-dom"
import EditDialog from "components/EditDialog"
import { useReducer, useState } from "react"
import UserForm from "components/UserForm"
import AlertDialog from "components/AlertDialog"

export default function UserTabPanel({ tabIndex }: TabPanelProps)
{
    const navigate = useNavigate()
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ showAlertDialog, setShowAlertDialog ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState<User | undefined>(undefined)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const userList = [ 
        new User("42", "Simon.R", UserType.ADMIN, new Date(), "simon@email.fr")
    ] // TODO: debug data

    const onUserEdit = (uuid: string) => {
        // Open user edit dialog
        setSelectedUser(getUserFromUuid(uuid))
        setShowEditDialog(true)
    }
    const onUserEditSubmit = () => {
        // TODO : API call => update selectedUser
        setShowEditDialog(false)
    }
    const onCloseUserEditDialog = () => {
        setShowEditDialog(false)
    }
    const onUserRemove = (uuid: string) => {
        setSelectedUser(getUserFromUuid(uuid))
        setShowAlertDialog(true)
    }
    const applyUserRemoval = () => {
        // Send remove Request to API
        // TODO: API call => selectedUser?.id
    }
    const onUserCreate = () => {
        // Open user create form dialog
        navigate('/signup')
    }
    const getUserFromUuid = (uuid: string) => {
        return userList.find((user: User) => user.id == uuid)
    }

    return (
        <CustomTabPanel value={tabIndex} index={0}>
            <IconButton size='medium' onClick={onUserCreate} sx={{ mb: 1 }}>
                <CreateIcon />
            </IconButton>
            <UserTable userList={userList} onEditUser={onUserEdit} onRemoveUser={onUserRemove} />
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