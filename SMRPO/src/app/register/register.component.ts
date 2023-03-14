import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,
    private authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
  }

  public error:string = "";
  public passwordVisible:boolean = false;

  public showPassword():void {
    if (this.passwordVisible) 
      this.passwordVisible = false
    else
      this.passwordVisible = true;
  };

  public hide():void{
    this.error=""
  }

  public register = (): void => {
    if (!this.user.email || !this.user.password || !this.user.firstname || !this.user.lastname || !this.user.username) {
      this.error = "Please fill in all fields!"
    } else if (!this.authenticationService.validateEmail(this.user.email)) {
      this.error = "Please enter valid email!"
    } else {
      if (this.authenticationService.validatePassword(this.user.password)!=""){
        this.error = this.authenticationService.validatePassword(this.user.password)
      } else {
        this.authenticationService.register(this.user)
      .then(() => {
        //console.log("success")
        this.router.navigateByUrl("/" );
      })
      .catch(message => {
        this.error = message
      })
      }
    }
  }

  public user: User = {
    _id: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    privilege: "",
    timestamp: new Date()
  };
}
