import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from './classes/project';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public addProject(data:any): Promise<Project> {
    console.log(data)
    const url: string = `${this.apiUrl}/db/project/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Project)
      .catch(this.processError);
  }

  public getProject(id_of_project:any): Promise<Project> {
    const url: string = `${this.apiUrl}/db/project/${id_of_project}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Project)
      .catch(this.processError);
  }

  public getProjects(): Promise<Project[]> {
    const url: string = `${this.apiUrl}/db/projects`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Project[])
      .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
