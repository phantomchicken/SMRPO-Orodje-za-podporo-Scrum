import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styles: [
  ]
})
export class UserProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected authenticationService: AuthenticationService,
    private router: Router,
    private userDataService: UsersDataService) { }
  
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userDataService.getUser(params['id']).then((data: User) => {
        this.user = data
      })
    })
  }

  private routeSub!: Subscription;
  public error:string = "";
  public success:boolean = false; 
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
    this.success = false
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
                this.error = "Password update failed!"
              });
            }
          }).catch(message => {
            this.error = "Current password not valid!"
          });
        });
      } 
    }
  }

  public editUser(): void {
    this.success = false
    this.error=""
    if (!this.user.email || !this.user.firstname || !this.user.lastname || !this.user.username) {
      this.error = "Please fill in all fields!"
    } else if (!this.authenticationService.validateEmail(this.user.email)) {
      this.error = "Please enter a valid email!"
    } else {
      this.userDataService.updateUser(this.user).then(() => {
        this.success = true
      }).catch((error) => {
        if (error.error.code==11000) this.error = "User with this username/e-mail already exists!";
        else console.error(error);
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
    privilege: "",
    timestamp: new Date(),
    login_counter: 0,
    archived: false
  };

}
