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
    const url: string = `${this.apiUrl}/users/`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as User)
      .catch(this.procesError);
  }

  public getUser(id_of_user:any): Promise<User> {
    const url: string = `${this.apiUrl}/users/${id_of_user}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as User)
      .catch(this.procesError);
  }


  public updateUserData(user: User): Promise<User> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('rentdrive-token')}`
      })
    };
    return this.http
      .put(url, user, httpLastnosti)
      .toPromise()
      .then(response => response as User)
      .catch (this.procesError);
  }

  public deleteUser(user: User): Promise<void> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('rentdrive-token')}`
      })
    };
    return this.http
      .delete(url, httpLastnosti)
      .toPromise()
      .then()
      .catch(this.procesError);
  }

  public login(user: User): Promise<AuthenticationResult> {
    return this.authentication('users/login', user);
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
      .catch(this.procesError);
  }


  private procesError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
