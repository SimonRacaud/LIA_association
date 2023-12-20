import IDataModel from "models/IModel";

export enum TeamType {
    RAMASSAGE,
    DISTRIB
}

export const teamTypeToString = (teamType: TeamType): string => {
    return TeamType[teamType];
};

export const teamTypeOptions = [ TeamType.RAMASSAGE, TeamType.DISTRIB ]

export default class TeamTemplate implements IDataModel {
    uuid: string
    title: string
    type: TeamType
    note: string
    maxMember: number

    constructor(uuid: string, title: string, type: TeamType, note: string, maxMember: number) {
        this.uuid = uuid
        this.title = title
        this.type = type
        this.note = note
        this.maxMember = maxMember
    }
}