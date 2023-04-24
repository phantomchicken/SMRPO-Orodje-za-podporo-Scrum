import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AdminViewComponent } from '../admin-view/admin-view.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AddProjectComponent } from '../add-project/add-project.component';
import { ProjectsComponent } from '../projects/projects.component';
import {AddSprintComponent} from "../add-sprint/add-sprint.component";
import { ProjectComponent } from '../project/project.component';
import { AdminEditUserComponent } from '../admin-edit-user/admin-edit-user.component';
import { AdminEditProjectComponent } from '../admin-edit-project/admin-edit-project.component';
import { SprintComponent } from '../sprint/sprint.component';


const paths: Routes = [
  {
    path: '',
    component: ProjectsComponent
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
    path: 'users/:id',
    component: UserProfileComponent
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
  },{
    path: 'project/:id/edit',
    component: AdminEditProjectComponent
  },
  {
    path: 'sprint/:id',
    component: SprintComponent
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
