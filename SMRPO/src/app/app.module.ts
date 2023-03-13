import { NgModule } from '@angular/core';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';

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
    AddSprintComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PasswordStrengthMeterModule.forRoot()
  ],
  providers: [],
  bootstrap: [TemplateComponent]
})
export class AppModule { 
  title = 'SMRPO';
}
