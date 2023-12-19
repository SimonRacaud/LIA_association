import { UserType } from "classes/User"

export default class LoginReponse {
    token: string
    username: string
    role: UserType

    constructor(data: any) {
        this.token = data.token;
        this.username = data.username;
        this.role = data.role as UserType
    }
}