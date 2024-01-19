import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import User from "classes/User";
import UserRow from "./UserRow";

export interface UserTableProps 
{
    userList?: User[],
    onEditUser?: (uuid: string) => void
    onRemoveUser: (uuid: string) => void
    short?: boolean
}

export default function UserTable({ userList, onEditUser, onRemoveUser, short }: UserTableProps)
{
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom d'utilisateur</TableCell>
                        {!short &&
                            <TableCell>Rôle</TableCell>
                        }
                        {!short &&
                            <TableCell>Date de création</TableCell>
                        }
                        <TableCell>E-mail</TableCell>
                        {!short &&
                            <TableCell>Lieu</TableCell>
                        }
                        {onEditUser &&
                            <TableCell align='right'>Editer</TableCell>
                        }
                        <TableCell align='right'>Supprimer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {userList?.map((user) => (
                    <UserRow key={user.username} user={user} 
                        onRemove={onRemoveUser} 
                        onEdit={onEditUser}
                        short={short} />
                ))}
                </TableBody>
            </Table>
            {userList?.length == 0 &&
                <Typography variant="subtitle2" color="text.secondary" sx={{ mx: 1}}>
                    Aucun membre inscrit
                </Typography>
            }
        </TableContainer>
    )
}