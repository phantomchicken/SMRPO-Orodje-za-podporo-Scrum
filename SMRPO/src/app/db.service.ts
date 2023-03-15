import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../app/classes/user';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public addSampleData(): Promise<any> {
    const url: string = `${this.apiUrl}/db/sample`; // change to only db in the future
    return this.http
      .post(url, null)
      .toPromise()
      .then(response => response as any)
      .catch(this.processError);
  }

  public deleteAllData(): Promise<any> {
    const url: string = `${this.apiUrl}/db/`; // db deleted!
    return this.http
      .delete(url)
      .toPromise()
      .then(response => response as any)
      .catch(this.processError);
  }

  public getData(): Promise<User[]> {
    const url: string = `${this.apiUrl}/db/`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as User[])
      .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
