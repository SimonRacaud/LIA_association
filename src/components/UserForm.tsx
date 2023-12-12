import { Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import User, { UserType, userTypeOptions, userTypeToString } from "classes/User"
import ShowDate from "./ShowDate"


type UserFormProps = {
    user?: User
    setUser: (u: User) => void
}

export default function UserForm({ user, setUser }: UserFormProps)
{
    if (!user) {
        user = new User("", "", UserType.MEMBRE, new Date(), "")
    }

    const handleChangeUserType = (event: SelectChangeEvent) => {
        if (user) {
            user.role = userTypeOptions[Number(event.target.value)] ?? UserType.MEMBRE
            setUser(user)
        }
    }

    return (
        <Card sx={{ p: 1 }}>
            <Stack spacing={2}>
                <TextField label="Nom d'utilisateur" />
                <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="user-type-label">Type</InputLabel>
                    <Select
                        labelId="user-type-label"
                        value={user?.role.toString() ?? userTypeToString(UserType.MEMBRE)}
                        onChange={handleChangeUserType}
                    >
                        {userTypeOptions.map((option) => {
                            return (                   
                                <MenuItem key={option} value={option}>{userTypeToString(option)}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                {user &&
                    <Typography color="text.secondary" variant="subtitle2" sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'space-between',
                        width: 200
                    }}>
                        <p>Créé le: </p>
                        <ShowDate date={user.created_at} showYear={true}/>
                    </Typography>
                }
                <TextField label="E-mail" />
            </Stack>
        </Card>
    )
}