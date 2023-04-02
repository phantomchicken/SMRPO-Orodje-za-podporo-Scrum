import { NgModule } from '@angular/core';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsComponent } from './projects/projects.component';
import { MatTableModule} from '@angular/material/table'
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ProjectComponent } from './project/project.component';
import { AddStoryComponent } from './add-story/add-story.component';
import { AdminEditUserComponent } from './admin-edit-user/admin-edit-user.component';


@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AdminViewComponent,
    ResetPasswordComponent,
    AddProjectComponent,
    ProjectsComponent,
    AddSprintComponent,
    ProjectComponent,
    AddStoryComponent,
    AdminEditUserComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PasswordStrengthMeterModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [TemplateComponent]
})
export class AppModule { 
  title = 'SMRPO';
}
