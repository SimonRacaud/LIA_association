import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Place from "classes/Place"
import DeleteIcon from '@mui/icons-material/Delete';
import ShowDate from "components/ShowDate";

export interface PlaceTableProps 
{
    list?: Place[],
    onEdit?: (uuid: string) => void
    onRemove: (uuid: string) => void
}

export default function PlaceTable({ list, onEdit, onRemove }: PlaceTableProps)
{
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Lieu</TableCell>
                        <TableCell>Création</TableCell>
                        <TableCell>Mise à jour</TableCell>
                        {onEdit &&
                            <TableCell align='right'>Editer</TableCell>
                        }
                        <TableCell align='right'>Supprimer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {list?.map((data) => (
                    <TableRow key={data.uuid}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>{data.label}</TableCell>
                        <TableCell><ShowDate date={data.created_at} showYear={true} /></TableCell>
                        <TableCell><ShowDate date={data.updated_at} showYear={true} /></TableCell>
                        {onEdit &&
                            <TableCell align="right">
                                <Button variant="outlined" onClick={() => onEdit(data.uuid)}>Éditer</Button>
                            </TableCell>
                        }
                        <TableCell align="right">
                            <IconButton aria-label="remove" size='small' onClick={() => onRemove(data.uuid)}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {list?.length == 0 &&
                <Typography variant="subtitle2" color="text.secondary" sx={{ mx: 1}}>
                    Rien à afficher
                </Typography>
            }
        </TableContainer>
    )
}