import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AdminViewComponent } from '../admin-view/admin-view.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';


const paths: Routes = [
  {
    path: '',
    component: HomeComponent
  }, 
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminViewComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
  
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(paths)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
