import { Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import User, { UserType, userTypeOptions, userTypeToString } from "classes/User"
import ShowDate from "./ShowDate"
import { ChangeEvent } from "react"


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
            user.role = event.target.value as UserType
            setUser(user)
        }
    }
    const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        if (user) {
            user.username = e.target.value
            setUser(user)
        }
    }
    const onChangeUserEmail = (e: ChangeEvent<HTMLInputElement>) => {
        if (user) {
            user.email = e.target.value
            setUser(user)
        }
    }
    const onChangeUserPassword = (e: ChangeEvent<HTMLInputElement>) => {
        if (user) {
            user.password = e.target.value
            setUser(user)
        }
    }
    return (
        <Card sx={{ p: 1 }}>
            <Stack spacing={2}>
                <TextField label="Nom d'utilisateur" defaultValue={user.username} onChange={onChangeUsername} />
                <TextField label="E-mail" defaultValue={user.email} onChange={onChangeUserEmail} />
                <TextField label="Mot de passe" placeholder="Nouveau mot de passe" defaultValue={user.password} onChange={onChangeUserPassword} />
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
            </Stack>
        </Card>
    )
}