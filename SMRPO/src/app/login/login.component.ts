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

  public passwordVisible: boolean = false;
  public error:string = "";
  public hide():void{
    this.error=""
  }

  public showPassword(): void {
    if (this.passwordVisible)
      this.passwordVisible = false
    else
      this.passwordVisible = true;
  };

  ngOnInit(): void {
  }

  login(): void {
    if (
      !this.user.username ||
      !this.user.password
    ) {
      this.error = "Please fill in all fields!"
    } else {
      this.authenticationService
        .login(this.user)
        .then(() => {
          this.router.navigate(['/']); // have to reload because of sidebar! more elegant solution probably exists
          //this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> 
          //this.router.navigate(['/']));
        })
        .catch(message => {
          //this.error = message
          this.error = "Username or password wrong!"
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
