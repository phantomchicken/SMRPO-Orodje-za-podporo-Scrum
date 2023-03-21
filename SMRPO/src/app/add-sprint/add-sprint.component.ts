import {Component, Input, OnInit} from '@angular/core';
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

  constructor(private sprintService: SprintDataService) { }

  addSprint(): void {
    let today = new Date()
    let sDate = new Date(this.sprint.startDate)
    let eDate = new Date(this.sprint.endDate)
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
        if (!overlap) {
          this.sprintService.addSprint(this.sprint)
              .then((sprint: Sprint) => {
                this.success = true;
                console.log('Sprint added!');
              })
              .catch((error) => {
                console.error(error);
              });
          this.error = "";
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
