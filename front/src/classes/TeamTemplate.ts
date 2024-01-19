import IDataModel from "models/IModel";
import IModelTime from "models/IModelTime";
import Place, { PlaceDto } from "./Place";

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

export default class TeamTemplate implements IDataModel, IModelTime {
    uuid: string
    title: string
    type: TeamType
    note: string
    maxMember: number
    place?: Place
    created_at?: Date
    updated_at?: Date

    constructor(uuid: string, title: string, type: TeamType, note: string, maxMember: number, place?: Place, created_at?: Date, updated_at?: Date) {
        this.uuid = uuid
        this.title = title
        this.type = type
        this.note = note
        this.maxMember = maxMember
        this.place = place
        this.created_at = created_at
        this.updated_at = updated_at
    }
}

export interface TeamTemplateDTO extends IDataModel, IModelTime {
    title: string,
    type: string,
    note: string,
    maxMember: number
    place?: PlaceDto
    place_uuid?: string
}