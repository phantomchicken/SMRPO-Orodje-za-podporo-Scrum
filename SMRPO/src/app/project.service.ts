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

  public addDocs(id_of_project:any, data:any): Promise<any> {
    console.log(data)
    const url: string = `${this.apiUrl}/db/project/${id_of_project}/docs`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .post(url, data, httpLastnosti)
      .toPromise()
      .then(response => response as any)
      .catch(this.processError);
  }
  
  public addProject(data:any): Promise<Project> {
    //console.log(data)
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

  public updateProject(project:Project): Promise<Project> {
    const url: string = `${this.apiUrl}/db/project/${project._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
        .put(url, project, httpLastnosti)
        .toPromise()
        .then(response => response as Project)
        .catch(this.processError);
  }

  public deleteProject(project: Project): Promise<void> {
    const url: string = `${this.apiUrl}/db/project/${project._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .delete(url, httpLastnosti)
      .toPromise()
      .then()
      .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
