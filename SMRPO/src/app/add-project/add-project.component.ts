import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../project.service';
import {Project} from '../classes/project';
import { UsersDataService } from '../user.service';
import { User } from '../classes/user';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: `add-project.component.html`,
  styles: [ 
  ]
})
export class AddProjectComponent implements OnInit {

  constructor(private router: Router,
              private projectService: ProjectDataService,
              private userService: UsersDataService) { }
  public error:string ="";
  
  public users: User[] = [];

  public hide():void{
    this.error=""
  }

  addProject(): void {
    this.error =""
    if (!this.project.name || !this.project.description || !this.project.scrum_master || !this.project.product_owner || this.project.developers.length == 0) {
      this.error = "Please enter all fields!"
    } else if (this.project.scrum_master == this.project.product_owner) {
      this.error = "Scrum master and product owner can't be the same person!"
    }else{
      //console.log(this.project)
      this.projectService.addProject(this.project)
        .then((project: Project) => {
          this.error =""
          console.log('Project added!'); 
          this.router.navigateByUrl('/projects')//TODO: redirect
        })
        .catch((error) => {
          if (error.error.code==11000) this.error = "Project with this name already exists!";
          else console.error(error);
        });
      this.error = "";
    }
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  usersFormControl = new FormControl('white');
  ngOnInit(): void {
     this.userService.getUsers().then((users: User[]) => {
      this.users = users;      
      console.log(users);
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
