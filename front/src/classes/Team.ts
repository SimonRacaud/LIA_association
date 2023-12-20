import IDataModel from "models/IModel";
import TeamTemplate from "./TeamTemplate";
import User from "./User";

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