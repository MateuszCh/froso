export interface IFieldData {
    title: string;
    type: string;
    id: string;
    selectOptions?: string;
    multiselectOptions?: string;
    repeaterFields?: IFieldData[];
}

export class Field {
    constructor(protected data: IFieldData) {}
}
