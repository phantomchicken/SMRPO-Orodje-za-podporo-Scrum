import { Component, OnInit } from '@angular/core';
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

  constructor(private sprintService: SprintDataService) { }

  addSprint(): void {
    this.sprint.project = ""; //TODO: IMPLEMENT PROJECT REF
    if (!this.sprint.startDate || !this.sprint.endDate || !this.sprint.velocity) {
      this.error = "Please enter all fields!"
    } else if (this.sprint.startDate > this.sprint.endDate){
      this.error = "Sprint ends before it starts!"
    }else if (this.sprint.velocity < 0 || this.sprint.velocity > 100){
      this.error = "Sprint velocity is invalid!"
    } else{
      // add backend call
      this.sprintService.addSprint(this.sprint)
        .then((sprint: Sprint) => {
          console.log('Sprint added!'); //TODO: redirect
        })
        .catch((error) => {
          console.error(error);
        });
      this.error = "";
    }
  }

  hide() {
    this.error=""
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
