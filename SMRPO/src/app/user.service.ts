import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './classes/user';
import { AuthenticationResult } from './classes/authentication-result';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public createUser(data:any): Promise<User> {
    const url: string = `${this.apiUrl}/user/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as User)
      .catch(this.processError);
  }

  public getUser(id_of_user:any): Promise<User> {
    const url: string = `${this.apiUrl}/db/user/${id_of_user}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as User)
      .catch(this.processError);
  }


  public updateUser(user: User): Promise<User> {
    const url: string = `${this.apiUrl}/db/user/${user._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .put(url, user, httpLastnosti)
      .toPromise()
      .then(response => response as User)
      .catch (this.processError);
  }

  public deleteUser(user: User): Promise<void> {
    const url: string = `${this.apiUrl}/db/user/${user._id}`;
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

  public getUsers(): Promise<User[]> {
    const url: string = `${this.apiUrl}/db/users`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as User[])
      .catch(this.processError);
  }

  public login(user: User): Promise<AuthenticationResult> {
    return this.authentication('user/login', user);
  }

  public register(user: User): Promise<AuthenticationResult> {
    return this.authentication('user/', user);
  }


  private authentication(urlname: string, user: User): Promise<AuthenticationResult> {
    const url: string = `${this.apiUrl}/db/${urlname}` //`http://localhost:3000/api/user`
    return this.http
      .post(url, user)
      .toPromise()
      .then(rezultat => rezultat as AuthenticationResult)
      .catch(this.processError);
  }


  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
