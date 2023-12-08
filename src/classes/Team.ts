import TeamTemplate from "./TeamTemplate";
import User from "./User";

export default class Team {
    template: TeamTemplate
    members: User[]

    constructor(template: TeamTemplate, members: User[] = []) {
        this.template = template
        this.members = members
    }
}