import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Task} from "../classes/task";
import { TasksDataService } from '../task.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-task',
  templateUrl: `add-task.component.html`,
  styles: [
  ]
})
export class AddTaskComponent implements OnInit {

  error: string = "";
  priorityFormControl = new FormControl('white');

  constructor(private router: Router,
              private taskService: TasksDataService) { }

  @Input() story:string = "";
  
  @Output() messageEvent = new EventEmitter<string>();
  sendMessage() {
    this.messageEvent.emit("task")
  }

  ngOnInit(): void {
    this.task.story = this.story;
    this.error =""
    this.success=false
  }

  addTask() {
    this.error =""
    this.success=false
    if (!this.task.name || !this.task.timeEstimate) {
      this.error = "Please enter all fields!"
    } else {
      let overlap = false
      this.taskService.getTasks().then((tasks:Task []) => { // get all stories and check for same name only for those concerning the same project
        for (var i=0;i<tasks.length;i++) {
          if (tasks[i].story == this.story) {
            if (tasks[i].name == this.task.name) {
              this.error = "Task with this name already exists!"
              overlap = true
              break
            }
          }
        }
        if (!overlap) {
          this.taskService.createTask(this.task)
        .then((task: Task) => {
          this.success = true;
          this.error = ""
          console.log('Task added!')
          this.sendMessage()
        })
        .catch((error) => {
          if (error.error.code==11000) this.error = "Task with this name already exists!";
          else console.error(error);
        })
        }
      })
    }
    
  }

  hide() {
    this.error = ""
    this.success = false
  }

  public task: Task = {
    _id: '',
    name: '',
    assignee: undefined,
    story: '',
    done: false,
    accepted: false,
    timeEstimate: -1
  }
  public success:boolean = false;
}
