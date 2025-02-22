import {Task} from "./task";

export class WorkLog {
    _id: string  = "";
    task: string = "";
    assignee: string = "";
    startTime: Date = new Date();
    stopTime: Date | undefined;
    task_data: Task = new Task();
    myEstimation: Number | undefined;
}
