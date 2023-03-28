import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SprintDataService } from '../sprint.service';
import {Sprint} from '../classes/sprint';

@Component({
  selector: 'app-add-sprint',
  templateUrl: `add-sprint.component.html`,
  styles: [''
  ]
})
export class AddSprintComponent implements OnInit {
  public error:string ="";
  public success:boolean = false;
  @Input() project:string = "";

    
  @Output() messageEvent = new EventEmitter<string>();
  sendMessage() {
    console.log("send message")
    this.messageEvent.emit("sprint")
  }

  constructor(private sprintService: SprintDataService) { }

  addSprint(): void {
    let todayDate = new Date()
    let startDate = new Date(this.sprint.startDate)
    let endDate = new Date(this.sprint.endDate)

    let today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()))
    let sDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()))
    let eDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))

    if (sDate.getDay() === 6 || sDate.getDay() === 0){
      this.error = "Sprint must not start at weekend!"
      return
    }

    if (eDate.getDay() === 6 || eDate.getDay() === 0){
      this.error = "Sprint must not end at weekend!"
      return
    }

    this.sprint.project = this.project;
    if (!this.sprint.startDate || !this.sprint.endDate || !this.sprint.velocity) {
      this.error = "Please enter all fields!"
    } else if (sDate.getTime() > eDate.getTime()){
      this.error = "Sprint ends before it starts!"
    } else if (sDate.getTime() < today.getTime()){
      this.error = "Sprint starts before today!"
    }else if (isNaN(+this.sprint.velocity) || this.sprint.velocity < 0 || this.sprint.velocity > 100){
      this.error = "Sprint velocity is invalid!"
    } else{
      // add backend call
      let overlap = false
      this.sprintService.getSprints()
          .then((sprints: Sprint[]) => {
        for (var i=0; i < sprints.length; i++){
            if (sprints[i].project == this.project) { // get all sprints and check for overlap only for those concerning the same project
              let s_i = new Date(sprints[i].startDate)
              let e_i = new Date(sprints[i].endDate)
              if ((sDate.getTime() >= s_i.getTime() && sDate.getTime() <= e_i.getTime())
                || (eDate.getTime() >= s_i.getTime() && eDate.getTime() <= e_i.getTime())
                || (s_i.getTime() >= sDate.getTime() && s_i.getTime() <= eDate.getTime())
                || (e_i.getTime() >= sDate.getTime() && e_i.getTime() <= eDate.getTime())){
                  this.error = "Sprint overlaps with an existing sprint!"
                  overlap = true
                  break
              }
            }
        }
        if (!overlap) {
          this.sprintService.addSprint(this.sprint)
              .then((sprint: Sprint) => {
                this.success = true;
                this.error = "";
                this.sendMessage()
                console.log('Sprint added!');
              })
              .catch((error) => {
                this.error = error;
                console.error(error);
              });
        }
      })
    }
  }

  hide() {
    this.error=""
    this.success=false
  }

  ngOnInit(): void {
  }

  public sprint: Sprint = {
    _id: "",
    startDate: new Date(),
    endDate: new Date(),
    velocity: -1,
    project: ""
  };
}
