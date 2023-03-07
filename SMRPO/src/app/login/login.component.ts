import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    if (
      !this.user.username ||
      !this.user.password
    ) {
      console.log("bad")
    } else {
      this.authenticationService
        .login(this.user)
        .then(() => {
          this.router.navigateByUrl("/");
        })
        .catch(message => {
          console.log(message)
        });
    }
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
