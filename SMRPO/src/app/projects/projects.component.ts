import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-projects',
  templateUrl: `projects.component.html`,
  styles: ['.card:hover {box-shadow: 0 0 10px orange;}'
  ]
})
export class ProjectsComponent implements OnInit {
  

  //TODO: fetch projects from project service, populate cards 

  constructor(private authenticationService: AuthenticationService) { }
  public isLogged: boolean = false

  public is_user_logged(): void {
    this.isLogged = this.authenticationService.is_logged();
  }

  ngOnInit(): void {
    this.is_user_logged()
  }

}
