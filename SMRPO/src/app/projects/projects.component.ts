import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Project } from '../classes/project';
import { ProjectDataService } from '../project.service';

@Component({
  selector: 'app-projects',
  templateUrl: `projects.component.html`,
  styles: ['.card:hover {box-shadow: 0 0 10px orange;}'
  ]
})
export class ProjectsComponent implements OnInit {
  

  //TODO: fetch projects from project service, populate cards 

  constructor(protected authenticationService: AuthenticationService, private projectDataService: ProjectDataService) { }
  public projects: Project[] = []
  ngOnInit(): void {
    if (!this.authenticationService.is_logged()) return
    this.projectDataService.getProjects().then((data: Project[]) => {
      this.projects = data;
    })
  }

}
