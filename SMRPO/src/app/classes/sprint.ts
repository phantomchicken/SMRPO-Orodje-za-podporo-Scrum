export class Sprint {
    _id: string  = "";
    startDate: Date = new Date();
    endDate: Date = new Date();
    velocity: number = 0;
    project: string = ""
    editable: boolean = false;
    isEditing: boolean = false;
    updated: boolean = false;
    update_error: string = "";
}
