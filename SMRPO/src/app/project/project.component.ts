import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../classes/project';
import { User } from '../classes/user';
import { ProjectDataService } from '../project.service';

@Component({
  selector: 'app-project',
  templateUrl: `project.component.html`,
  styles: [
  ]
})
export class ProjectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private projectDataService: ProjectDataService) { }
  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      //console.log(params) //log the entire params object
      //console.log(params['id']) //log the value of id
      this.projectDataService.getProject(params['id']).then((project: Project) => {
        this.project = project;      
       });
    });
  }


  public project: Project = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: new User,
    product_owner: new User
  };
}
