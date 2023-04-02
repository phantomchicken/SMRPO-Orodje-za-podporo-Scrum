import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AdminViewComponent } from '../admin-view/admin-view.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AddProjectComponent } from '../add-project/add-project.component';
import { ProjectsComponent } from '../projects/projects.component';
import {AddSprintComponent} from "../add-sprint/add-sprint.component";
import { ProjectComponent } from '../project/project.component';
import { AdminEditUserComponent } from '../admin-edit-user/admin-edit-user.component';


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
    path: 'admin/edit/:id',
    component: AdminEditUserComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },{
    path: 'projects/add',
    component: AddProjectComponent
  },{
    path: 'projects',
    component: ProjectsComponent
  },{
    path: 'add-sprint',
    component: AddSprintComponent
  },{
    path: 'project/:id',
    component: ProjectComponent
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
