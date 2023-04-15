import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../classes/project';
import { User } from '../classes/user';
import { ProjectDataService } from '../project.service';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-admin-edit-project',
  templateUrl: `admin-edit-project.component.html`,
  styles: [
  ]
})
export class AdminEditProjectComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectDataService,
    private userService: UsersDataService) { }

private routeSub!: Subscription;
public error:string ="";
public users: User[] = [];
public scrum_master_id: string = ""
public product_owner_id: string = ""
public scrum_master: User = new User()
public product_owner: User = new User()
public developers: User[] = []
public toppings2: string[] = ['cheese','tomato']
public toppings: string[] = ['cheese','tomato','mushrooms']
public hide():void{
  this.error=""
}
  editProject(): void {
    this.error =""
    if (!this.project.name || !this.project.description || this.project.scrum_master==(new User) || this.project.product_owner==(new User) || this.project.developers.length == 0) {
      this.error = "Please enter all fields!"
    } else if (this.project.scrum_master == this.project.product_owner) {
      this.error = "Scrum master and product owner can't be the same person!"
    }else{
      //console.log(this.project)
      this.projectService.updateProject(this.project)
        .then((project: Project) => {
          this.error =""
          this.router.navigateByUrl('/projects')
        })
        .catch((error:any) => {
          if (error.error.code==11000) this.error = "Project with this name already exists!";
          else console.error(error);
        });
      this.error = "";
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectService.getProject(params['id']).then((data: Project) => {
        this.project = data
        this.product_owner_id = this.project.product_owner.toString()
        this.scrum_master_id = this.project.scrum_master.toString()
        this.userService.getUser(this.scrum_master_id).then((data:User)=>{
          this.scrum_master = data
          console.log(data);
        })
        this.userService.getUser(this.product_owner_id).then((data:User)=>{
          this.product_owner = data
        })
        for (var i=0; i<this.project.developers.length; i++){
          this.userService.getUser(this.project.developers[i]).then((data:User)=>{
            this.developers.push(data)
            console.log(this.project.developers);
          console.log(this.developers);
          })
        }
      })
    })
    this.userService.getUsers().then((users: User[]) => {
      this.users = users;      
     });
  }

  compareToppings(topping1: User, topping2: User): boolean {
    console.log(topping1)
    return topping1._id === topping2._id;
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
