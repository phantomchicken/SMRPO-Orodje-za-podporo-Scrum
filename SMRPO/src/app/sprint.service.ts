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

  public createSprint(data:any): Promise<Sprint> {
    const url: string = `${this.apiUrl}/db/sprint`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Sprint)
      .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
