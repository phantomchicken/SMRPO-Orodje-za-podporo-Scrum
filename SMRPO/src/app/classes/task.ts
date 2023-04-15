export class Task {
    _id: string  = "";
    name: string  = "";
    assignee: string | undefined;
    story: string = "";
    done: boolean = false
    accepted: boolean = false
    timeEstimate: number = -1
}
