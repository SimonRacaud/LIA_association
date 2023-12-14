import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import User from "classes/User";
import UserRow from "./UserRow";

export interface UserTableProps 
{
    userList: User[],
    onEditUser?: (uuid: string) => void
    onRemoveUser: (uuid: string) => void
}

export default function UserTable({ userList, onEditUser, onRemoveUser }: UserTableProps)
{
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom d'utilisateur</TableCell>
                        <TableCell>Rôle</TableCell>
                        <TableCell>Date de création</TableCell>
                        <TableCell>E-mail</TableCell>
                        {onEditUser &&
                            <TableCell align='right'>Editer</TableCell>
                        }
                        <TableCell align='right'>Supprimer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {userList.map((user) => (
                    <UserRow key={user.username} user={user} 
                        onRemove={onRemoveUser} 
                        onEdit={onEditUser} />
                ))}
                </TableBody>
            </Table>
            {userList.length == 0 &&
                <Typography variant="subtitle2" color="text.secondary" sx={{ mx: 1}}>
                    Aucun membre inscrit
                </Typography>
            }
        </TableContainer>
    )
}