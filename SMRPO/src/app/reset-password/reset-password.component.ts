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
    protected authenticationService: AuthenticationService,
    private router: Router,
    private userDataService: UsersDataService) { }

  ngOnInit(): void {
  }

  public error:string = "";
  //public success:boolean = false; 
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

  public hide():void{
    this.error=""
  }

  resetPassword(): void {
    if (!this.authenticationService.is_logged()) return

    if (
      !this.oldPassword ||
      !this.newPassword1 || !this.newPassword2
    ) {
      this.error = "Please fill in all fields!"
    } else if ((this.newPassword1 != this.newPassword2)) {
      this.error = "New passwords must match!"
    } else {
      if (this.authenticationService.validatePassword(this.newPassword1)!=""){
        this.error = this.authenticationService.validatePassword(this.newPassword1)
      } else {
        this.userDataService
        .getUser(this.authenticationService.get_current_user()._id)
        .then((data: User) => {
          this.user = data
          this.user.password = this.oldPassword
          this.authenticationService.checkPassword(this.user).then((authenticationSuccess) => {
            if (authenticationSuccess) {
              this.user.password = this.newPassword1
              this.userDataService.updateUser(this.user).then(() => {
                this.error=""
                this.router.navigate(['/']); // have to reload because of sidebar! more elegant solution probably exists
              }).catch(message => {
                this.error = message
              });
            }
          }).catch(message => {
            this.error = message
          });
        });
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
    privilege: ""
  };

}
