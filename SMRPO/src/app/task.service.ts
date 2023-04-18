import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from './classes/task';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public createTask(data:any): Promise<Task> {
    const url: string = `${this.apiUrl}/db/task/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Task)
      .catch(this.processError);
  }

  public getTask(id_of_task:any): Promise<Task> {
    const url: string = `${this.apiUrl}/db/task/${id_of_task}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Task)
      .catch(this.processError);
  }


  public updateTask(task: Task): Promise<Task> {
    const url: string = `${this.apiUrl}/db/task/${task._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .put(url, task, httpLastnosti)
      .toPromise()
      .then(response => response as Task)
      .catch (this.processError);
  }

  public deleteTask(task: Task): Promise<void> {
    const url: string = `${this.apiUrl}/db/task/${task._id}`;
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

  public getTasks(): Promise<Task[]> {
    const url: string = `${this.apiUrl}/db/tasks`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Task[])
      .catch(this.processError);
  }


  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
