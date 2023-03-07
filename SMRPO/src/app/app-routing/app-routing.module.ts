import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';


const paths: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(paths)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
