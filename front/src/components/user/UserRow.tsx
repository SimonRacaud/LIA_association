import { Button, IconButton, TableCell, TableRow } from "@mui/material"
import ShowDate from "../ShowDate"
import User, { userTypeToString } from "classes/User"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export interface UserRowProps {
    user: User,
    onEdit?: (uuid: string) => void,
    onRemove: (uuid: string) => void,
    short?: boolean
}

export default function UserRow({ user, onEdit, onRemove, short }: UserRowProps)
{
    return (
        <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell>{user.username}</TableCell>
            {!short && <TableCell>{userTypeToString(user.role)}</TableCell> }
            {!short && 
                <TableCell component="th" scope="row">
                    <ShowDate date={user.created_at} showYear={true} />
                </TableCell>
            }
            <TableCell>{user.email}</TableCell>

            {onEdit &&
                <TableCell align="right">
                    <Button variant="outlined" onClick={() => onEdit(user.id)}>Éditer</Button>
                </TableCell>
            }
            <TableCell align="right">
                {!short &&
                    <Button variant="outlined" onClick={() => onRemove(user.id)}>Supprimer</Button>
                    || 
                    <IconButton aria-label="remove" size='small' onClick={() => onRemove(user.id)}>
                        <PersonRemoveIcon />
                    </IconButton>
                }
            </TableCell>
        </TableRow>
    )
}