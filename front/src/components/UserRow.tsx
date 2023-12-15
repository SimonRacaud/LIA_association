import { Button, TableCell, TableRow } from "@mui/material"
import ShowDate from "./ShowDate"
import User, { userTypeToString } from "classes/User"

export interface UserRowProps {
    user: User,
    onEdit?: (uuid: string) => void,
    onRemove: (uuid: string) => void,
}

export default function UserRow({ user, onEdit, onRemove }: UserRowProps)
{
    return (
        <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell>{user.username}</TableCell>
            <TableCell>{userTypeToString(user.role)}</TableCell>            
            <TableCell component="th" scope="row">
                <ShowDate date={user.created_at} showYear={true} />
            </TableCell>
            <TableCell>{user.email}</TableCell>

            {onEdit &&
                <TableCell align="right">
                    <Button variant="outlined" onClick={() => onEdit(user.id)}>Éditer</Button>
                </TableCell>
            }
            <TableCell align="right">
                <Button variant="outlined" onClick={() => onRemove(user.id)}>Supprimer</Button>
            </TableCell>
        </TableRow>
    )
}