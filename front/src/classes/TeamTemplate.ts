import IDataModel from "models/IModel";

export enum TeamType {
    RAMASSAGE = 'RAMASSAGE',
    DISTRIB = 'DISTRIB'
}

export const teamTypeToString = (teamType: TeamType): string => {
    switch (teamType) {
        case TeamType.RAMASSAGE:
            return "Ramassage"
        case TeamType.DISTRIB:
            return "Distribution"
        default:
            return "?"
    }
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

export interface TeamTemplateDTO extends IDataModel {
    title: string,
    type: string,
    note: string,
    maxMember: number
}