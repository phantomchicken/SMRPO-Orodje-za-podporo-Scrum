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

  public createProject(data:any): Promise<Project> {
    console.log(data)
    const url: string = `${this.apiUrl}/db/project/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Project)
      .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
