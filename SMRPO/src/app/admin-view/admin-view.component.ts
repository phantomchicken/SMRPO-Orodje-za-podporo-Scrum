import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';
import { UsersDataService } from '../user.service';
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-admin-view',
  templateUrl :'admin-view.component.html',
  styles: ['th.mat-header-cell {text-align: center !important;}'
  ]
})
export class AdminViewComponent implements OnInit {

  constructor(protected authenticationService: AuthenticationService, private router:Router, private userService: UsersDataService) { }

  public dataSource: MatTableDataSource<User> = new MatTableDataSource();
  public users:User[]=[]
  public displayedColumns = ['username', 'firstname', 'lastname', 'email', 'privilege']; //id
  public error:string = "";
  public success:boolean = false;
  public passwordVisible:boolean = false;

  public showPassword():void {
    if (this.passwordVisible) 
      this.passwordVisible = false
    else
      this.passwordVisible = true;
  };

  public is_user_logged(): boolean {
    return this.authenticationService.is_logged();
  }

  public addUser():void {
    console.log(this.user.privilege)
    if (!this.user.email || !this.user.password || !this.user.firstname || !this.user.lastname || !this.user.username || !this.user.privilege) {
      this.error = "Please fill in all fields!"
    } else {
      this.userService.register(this.user)
      .then(() => {
        //console.log("success")
        this.success = true;
        this.users.push(this.user)
        this.dataSource.data = this.users
        //this.router.navigateByUrl("/");
      })
      .catch(error => {
        this.error = error;
      })
    }
  }

  ngOnInit(): void {
    this.userService.getUsers().then((data: User[]) => {
      this.users = data;
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

  public hide():void{
    this.error=""
    this.success=false;
  }

  public user: User = {
    _id: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    privilege: ""
  };

}
