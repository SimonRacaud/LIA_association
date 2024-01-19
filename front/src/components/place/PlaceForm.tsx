import Place from "classes/Place"
import { ChangeEvent } from "react";
import { Card,  Stack, TextField, Typography } from "@mui/material"
import ShowDate from "components/ShowDate";

type PlaceFormProps = {
    place?: Place
    setPlace: (d: Place) => void
}

export default function PlaceForm({ place, setPlace }: PlaceFormProps)
{
    if (!place) {
        place = new Place("", "");
    }

    const onChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
        if (place) {
            place.label = e.target.value
            setPlace(place)
        }
    }
    return (
        <Card sx={{ p: 1 }}>
            <Stack spacing={2}>
                <TextField label="Lieu" defaultValue={place.label} onChange={onChangeLabel} />
                {place &&
                    <Typography color="text.secondary" variant="subtitle2" sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'space-between',
                        width: 200
                    }}>
                        <p>Créé le: </p>
                        <ShowDate date={place.created_at} showYear={true}/>
                    </Typography>
                }
                {place &&
                    <Typography color="text.secondary" variant="subtitle2" sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'space-between',
                        width: 200
                    }}>
                        <p>Modifié le: </p>
                        <ShowDate date={place.updated_at} showYear={true}/>
                    </Typography>
                }
            </Stack>
        </Card>
    )
}