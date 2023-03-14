import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../project.service';
import {Project} from '../classes/project';

@Component({
  selector: 'app-add-project',
  templateUrl: `add-project.component.html`,
  styles: [ 
  ]
})
export class AddProjectComponent implements OnInit {

  constructor(private projectService: ProjectDataService) { }
  public error:string ="";
  
  public hide():void{
    this.error=""
  }

  addProject(): void { //TODO: error checking and BE
    if (!this.project.name || !this.project.description || !this.project.scrum_master || !this.project.product_owner || !this.project.developers) {
      this.error = "Please enter all fields!"
    } else if (this.project.scrum_master == this.project.product_owner) {
      this.error = "Scrum master and product owner can't be the same person!"
    }else{
      this.projectService.createProject(this.project)
        .then((project: Project) => {
          console.log('Project added!'); //TODO: redirect
        })
        .catch((error) => {
          console.error(error);
        });
      this.error = "";
    }
  }

  ngOnInit(): void {
  }

  public project: Project = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: "",
    product_owner: ""
  };

}
