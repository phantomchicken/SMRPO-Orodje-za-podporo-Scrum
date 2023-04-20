import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Project } from '../classes/project';
import { User } from '../classes/user';
import { ProjectDataService } from '../project.service';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-projects',
  templateUrl: `projects.component.html`,
  styles: ['.card:hover {box-shadow: 0 0 10px orange;}', '.scrum {background-color: lightgreen}', '.product {background-color: lightyellow}'
  ]
})
export class ProjectsComponent implements OnInit {
  
  constructor(protected authenticationService: AuthenticationService, private projectDataService: ProjectDataService, private userDataService: UsersDataService) { }
  public projects: any = []
  public loggedUser: User = new User
  ngOnInit(): void {
    // this.userDataService.getUser(this.authenticationService.get_current_user()._id).then((data: User)=>{
    //   this.loggedUser = data
    // })
    
    this.projectDataService.getProjects().then((data: Project[]) => {
      console.log(data)
      this.projects = data;
    })
  }

  getColor(project:any): string {
    if (project.scrum_master == this.authenticationService.get_current_user()._id) return "scrum"
    else if (project.product_owner == this.authenticationService.get_current_user()._id) return "product"
    else return ""
  }

  public project: any = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: "",
    product_owner: ""
  };
}
