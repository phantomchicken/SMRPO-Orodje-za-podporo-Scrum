import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Project } from '../classes/project';
import { User } from '../classes/user';
import { ProjectDataService } from '../project.service';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-project',
  templateUrl: `project.component.html`,
  styles: ['.tab-pane:not(.active) > {display: none;}'
  ]
})
export class ProjectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService) { }
  private routeSub!: Subscription;
  public product_owner_id: string = "" //
  public scrum_master_id: string = ""
  public product_owner: User = new User
  public scrum_master: User = new User
  public developers: User[] = []

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectDataService.getProject(params['id']).then((project: Project) => {
        this.project = project;
        this.product_owner_id = project.product_owner.toString()
        this.scrum_master_id = project.scrum_master.toString()
        this.usersDataService.getUser(this.scrum_master_id).then((data:User)=>{
          this.scrum_master = data
        })
        this.usersDataService.getUser(this.product_owner_id).then((data:User)=>{
          this.product_owner = data
        })
        for (var i=0; i<this.project.developers.length; i++){
          this.usersDataService.getUser(this.project.developers[i]).then((data:User)=>{
            this.developers.push(data)
          })
        }
       });
    });
    this.project_ref = this.project._id;
  }


  public project: Project = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: new User,
    product_owner: new User
  };
  public project_ref: string;
}
