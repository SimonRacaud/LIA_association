import IDataModel from "models/IModel";
import TeamTemplate from "./TeamTemplate";
import User from "./User";

export interface TeamDto {
    template_uuid?: string
    event_uuid?: string
    members_add?: string[]
    members_rm?: string[]
}

export default class Team implements IDataModel {
    uuid: string
    template: TeamTemplate
    members: User[]

    constructor(uuid: string, template: TeamTemplate, members: User[] = []) {
        this.uuid = uuid
        this.template = template
        this.members = members
    }
}