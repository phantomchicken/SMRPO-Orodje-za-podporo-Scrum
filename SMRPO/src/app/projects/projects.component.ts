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

  constructor(protected authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
