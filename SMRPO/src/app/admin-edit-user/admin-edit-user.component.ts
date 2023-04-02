import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { User } from '../classes/user';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-admin-edit-user',
  templateUrl: `admin-edit-user.component.html`,
  styles: [
  ]
})
export class AdminEditUserComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, protected authenticationService: AuthenticationService, private userService: UsersDataService) { }

  private routeSub!: Subscription;
  public warning: boolean = false
  public error: string = "";
  public success: boolean = false;
  public passwordVisible: boolean = false;
  public confirmPasswordVisible: boolean = false;
  public confirmPassword: string = ""
  
  public showPassword(): void {
    this.passwordVisible = this.passwordVisible ? false : true;
  };

  public showConfirmPassword(): void {
    this.confirmPasswordVisible = this.confirmPasswordVisible ? false : true;
  }

  public hide(): void {
    this.error = ""
    this.success = false
    this.warning = false    
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userService.getUser(params['id']).then((data: User) => {
        this.user = data
      })
    })
  }

  public editUser(): void {
    this.success = false
    this.error=""
    if (!this.user.email || !this.user.password || !this.user.firstname || !this.user.lastname || !this.user.username || !this.user.privilege) {
      this.error = "Please fill in all fields!"
    } else if (!this.authenticationService.validateEmail(this.user.email)) {
      this.error = "Please enter a valid email!"
    } else if (this.authenticationService.validatePassword(this.user.password) != "") {
      this.error = this.authenticationService.validatePassword(this.user.password)
    } else if (this.user.password != this.confirmPassword) {
      this.error = "Password and confirm password field should match!"
    }
    else {
      this.userService.updateUser(this.user).then(() => {
        this.success = true
      }).catch((error) => {
        if (error.error.code==11000) this.error = "User with this username/e-mail already exists!";
        else console.error(error);
      })
    }
  }

  public deleteUser(): void {
    this.userService.deleteUser(this.user).then(() => {
      if (this.user._id == this.authenticationService.get_current_user()._id){
        this.authenticationService.logout()
        this.router.navigateByUrl('/')
      } else 
        this.router.navigateByUrl('/admin')
    }).catch((error) => {
      this.error = error
      console.error(error);
    })
  }

  public showWarning(): void {
    this.warning = true
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
    login_counter: 0
};
}
