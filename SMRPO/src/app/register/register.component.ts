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

  public register = (): void => {
    if (!this.user.email || !this.user.password || !this.user.firstname || !this.user.lastname || !this.user.username) {
      //console.log("bad")
    } else {
      this.authenticationService.register(this.user)
      .then(() => {
        //console.log("success")
        this.router.navigateByUrl("/" );
      })
      .catch(sporocilo => {
        console.log(sporocilo)
      })
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
