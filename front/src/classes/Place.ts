import IDataModel from "models/IModel";
import IModelTime from "models/IModelTime";

export interface PlaceDto extends IDataModel, IModelTime {
    label: string
}

export default class Place implements IDataModel, IModelTime {
    uuid: string
    label: string
    created_at?: Date;
    updated_at?: Date;

    constructor(uuid: string, label: string, created_at?: Date, updated_at?: Date) {
        this.uuid = uuid;
        this.label = label;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}