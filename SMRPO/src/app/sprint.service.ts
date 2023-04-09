import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sprint } from './classes/sprint';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public addSprint(data:any): Promise<Sprint> {
    const url: string = `${this.apiUrl}/db/sprint`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Sprint)
      .catch(this.processError);
  }

  public getSprint(id_of_sprint:any): Promise<Sprint> {
    const url: string = `${this.apiUrl}/db/sprint/${id_of_sprint}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Sprint)
      .catch(this.processError);
  }

  public getSprints(): Promise<Sprint[]> {
    const url: string = `${this.apiUrl}/db/sprints`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Sprint[])
      .catch(this.processError);
  }

  public updateSprint(sprint:Sprint): Promise<Sprint> {
    const url: string = `${this.apiUrl}/db/sprint/${sprint._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
        .put(url, sprint, httpLastnosti)
        .toPromise()
        .then(response => response as Sprint)
        .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
