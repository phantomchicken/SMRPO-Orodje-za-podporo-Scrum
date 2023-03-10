import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html',
  styles: [
  ]
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userDataService: UsersDataService) { }

  ngOnInit(): void {
    this.isLogged = this.authenticationService.is_logged();
  }

  public isLogged: boolean = false
  protected oldPassword: string = "";
  public newPassword1: string = "";
  public newPassword2: string = "";
  public passwordVisible: boolean = false;
  public passwordVisible2: boolean = false;
  public passwordVisible3: boolean = false;

  public showPassword(): void {
    if (this.passwordVisible)
      this.passwordVisible = false
    else
      this.passwordVisible = true;
  };

  public showPassword2(): void {
    if (this.passwordVisible2)
      this.passwordVisible2 = false
    else
      this.passwordVisible2 = true;
  };

  public showPassword3(): void {
    if (this.passwordVisible3)
      this.passwordVisible3 = false
    else
      this.passwordVisible3 = true;
  };

  public get_user_data = (id_of_user: String): void => {
    this.userDataService
      .getUser(id_of_user)
      .then((data: User) => {
        this.user = data
        console.log(this.user)
      });
  }

  resetPassword(): void {
    if (!this.isLogged) return

    if (
      !this.oldPassword ||
      !this.newPassword1 || !this.newPassword2 || (this.newPassword1 != this.newPassword2)
    ) {
      console.log("bad")
    } else {
      
      this.userDataService
        .getUser(this.authenticationService.get_current_user()._id)
        .then((data: User) => {
          this.user = data
          this.user.password = this.newPassword1
          this.userDataService.updateUser(this.user).then(() => {
            this.router.navigate(['/']); // have to reload because of sidebar! more elegant solution probably exists
          })
            .catch(message => {
              console.log(message)
            });
        });
      //console.log("hey", this.user)

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
