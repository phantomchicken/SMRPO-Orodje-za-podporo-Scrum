import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkLog } from './classes/workLog';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkLogDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public createWorkLog(data:any): Promise<WorkLog> {
    const url: string = `${this.apiUrl}/db/workLog/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as WorkLog)
      .catch(this.processError);
  }

  public getWorkLog(id_of_workLog:any): Promise<WorkLog> {
    const url: string = `${this.apiUrl}/db/workLog/${id_of_workLog}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as WorkLog)
      .catch(this.processError);
  }


  public updateWorkLog(workLog: WorkLog): Promise<WorkLog> {
    const url: string = `${this.apiUrl}/db/workLog/${workLog._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .put(url, workLog, httpLastnosti)
      .toPromise()
      .then(response => response as WorkLog)
      .catch (this.processError);
  }

  public deleteWorkLog(workLog: WorkLog): Promise<void> {
    const url: string = `${this.apiUrl}/db/workLog/${workLog._id}`;
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

  public getWorkLogs(): Promise<WorkLog[]> {
    const url: string = `${this.apiUrl}/db/workLogs`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as WorkLog[])
      .catch(this.processError);
  }


  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
