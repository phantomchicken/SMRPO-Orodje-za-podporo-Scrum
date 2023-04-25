import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoggedHoursDialogComponent} from "../logged-hours-dialog/logged-hours-dialog.component";
import {EstimatedHoursDialogComponent} from "../estimated-hours-dialog/estimated-hours-dialog.component";
import {WorkLog} from "../classes/workLog";
import {WorkLogDataService} from "../workLog.service";
import {TasksDataService} from "../task.service";
import {UsersDataService} from "../user.service";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-time',
  templateUrl: `time.component.html`,
  styles: [
  ]
})
export class TimeComponent implements OnInit {
  dayTasksMap: Map<any, any> = new Map<any, any>();
  dayTasks: any[] = [];

  worklogs: WorkLog[]

  tasksRemaining: Map<string, number>;

  displayedColumns: string[] = ['taskNumber', 'loggedHours', 'remainingHours', 'estimatedHours', 'myEstimation'];

  constructor(private dialog: MatDialog, private WorkLog: WorkLogDataService, private taskService: TasksDataService,
              private UserService: UsersDataService, private AuthenticationService: AuthenticationService) {}

  openLoggedHoursDialog(task: any): void {
    const dialogRef = this.dialog.open(LoggedHoursDialogComponent, {
      width: '400px',
      data: { taskName: task.task_data.name, editedTime: this.getDurationString(task.startTime, task.stopTime)}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // update the task's loggedHours property with the new value
        console.log(`Logged Time: ${result.hours}h ${result.minutes}m ${result.seconds}s`);
        const new_task = Object.assign({}, task)
        let time: number = (result.hours*3600 + result.minutes*60 + result.seconds)*1000
        let logged_time = this.getLoggedTime(task.startTime, task.stopTime)
        let time_diff = logged_time - time
        let stopTimeDate = new Date(new_task.stopTime)
        let newStopTime = stopTimeDate.getTime() - time_diff
        new_task.stopTime = new Date(newStopTime)
        new_task.task_data = undefined
        this.WorkLog.updateWorkLog(new_task).then((up_task) =>{
          task.stopTime = up_task.stopTime
          this.tasksRemaining = this.calculateTaskDifferences(this.worklogs)
        }).catch((error) => {
          console.log(error)
        })
      }
    });
  }

  openEstimatedHoursDialog(task: any): void {
    const dialogRef = this.dialog.open(EstimatedHoursDialogComponent, {
      width: '400px',
      data: { taskName: task.task_data.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Estimated Time: ${result.hours}h ${result.minutes}m ${result.seconds}s`);
        const new_task = Object.assign({}, task)
        new_task.myEstimation = (result.hours*3600 + result.minutes*60 + result.seconds)*1000
        new_task.task_data = undefined
        this.WorkLog.updateWorkLog(new_task).then((up_task) =>{
          task.myEstimation = up_task.myEstimation
        }).catch((error) => {
          console.log(error)
        })
      }
    });
  }

  getDurationString(startDate: string, endDate: string): string {
    const diff = this.getLoggedTime(startDate, endDate);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  private getLoggedTime(startDate: string, endDate: string) {
    const sd = new Date(startDate)
    const ed = new Date(endDate)
    const diff = Math.abs(ed.getTime() - sd.getTime());
    return diff;
  }

  private getLoggedTimeDates(startDate: Date, endDate: Date) {
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    return diff;
  }

  getRemainingTime(startDate: string, endDate: string, estimatedTime: number) {
    console.log(startDate + "|||" + endDate);
    const diff = this.getLoggedTime(startDate, endDate)
    const remaining = estimatedTime*1000*3600 - diff
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  millisToTime(time: number | undefined){
    if (time == undefined){
      return undefined
    }
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  formatDate(dateString: string): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(dateString);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName}, ${day} ${year}`;
  }

  calculateTaskDifferences(data: any[]) {
    const taskDifferences = new Map<string, number>();
    data.forEach(item => {
      const { task, startTime, stopTime } = item;
      const diffInMs = new Date(stopTime).getTime() - new Date(startTime).getTime();
      const estimatedTimeInMs = item.task_data.timeEstimate * 60 * 60 * 1000;
      const currentSum = taskDifferences.get(task) || estimatedTimeInMs;
      console.log(currentSum)
      taskDifferences.set(task, currentSum - diffInMs);
    });
    return taskDifferences;
  }

  filterByAssignee(array: any[], constant: string): any[] {
    return array.filter(item => item.assignee === constant);
  }

  filterObjectsWithStopTime(objects: any[]): any[] {
    return objects.filter(object => object.stopTime !== undefined);
  }

  ngOnInit(): void {
    this.WorkLog.getWorkLogs().then((worklogs) => {
      this.worklogs = this.filterObjectsWithStopTime(this.filterByAssignee(worklogs, this.AuthenticationService.get_current_user()._id));
      console.log(this.worklogs);
      // Use Promise.all to wait for all promises to resolve
      Promise.all(this.worklogs.map((worklog) => {
        return this.taskService.getTask(worklog.task).then((task_data) => {
          console.log(this.worklogs);
          worklog.task_data = task_data;
          this.tasksRemaining = this.calculateTaskDifferences(this.worklogs)
        }).catch((error) => console.log(error));
      })).then(() => {
        // Once all promises have resolved, continue with the rest of the code
        console.log(this.worklogs);
        this.dayTasks = Object.values(this.worklogs.reduce((acc: { [key: string]: any }, task) => {
          const date = new Date(task.startTime);
          const dateString = date.toISOString().substring(0, 10);
          if (!acc[dateString]) {
            acc[dateString] = {dateString, tasks: []};
          }
          acc[dateString].tasks.push(task);
          console.log(acc)
          return acc;
        }, {}));
      });
    });

  }
}
