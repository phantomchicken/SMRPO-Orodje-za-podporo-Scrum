import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-admin-view',
  templateUrl :'admin-view.component.html',
  styles: [
  ]
})
export class AdminViewComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router:Router, private userService: UsersDataService) { }

  public isAdmin:boolean = false;
  public error:string = "";
  public success:boolean = false;  
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
        //this.router.navigateByUrl("/");
      })
      .catch(error => {
        this.error = error;
        console.log(error)
      })
    }
  }

  ngOnInit(): void {
    if (this.is_user_logged()) {
      if (this.authenticationService.get_current_user().privilege == "admin")
        this.isAdmin = true
    }
  }

  hide():void{
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
