export class WorkLog {
    _id: string  = "";
    task: string = "";
    assignee: string = "";
    startTime: Date = new Date();
    stopTime: Date | undefined;
}
