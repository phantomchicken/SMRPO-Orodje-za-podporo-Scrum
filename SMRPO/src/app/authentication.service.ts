import { Inject, Injectable } from '@angular/core';
import { Storage_Browser } from './classes/storage';
import { User } from './classes/user';
import { AuthenticationResult } from './classes/authentication-result';
import { UsersDataService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    @Inject(Storage_Browser) private storage: Storage,
    private userDataService: UsersDataService
  ) { }

  private b64Utf8(niz: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(niz),
          (znak: string) => {
            return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
          }
        )
        .join('')
    );
  };

  public is_logged(): boolean {
    const token : string = this.returnToken();
    if (token) {
      const koristnaVsebina = JSON.parse(this.b64Utf8(token.split('.')[1]));
      return koristnaVsebina.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public get_current_user(): User {
    if (this.is_logged()) {
      const token: string = this.returnToken();
      const { email, username, _id, privilege } = JSON.parse(this.b64Utf8(token.split('.')[1]));
      return { email, username, _id, privilege } as User;
    } else return new User // TODO
  }

  public get_email_from_recover_token(token: string): User {
    const { email, username, _id, privilege  } = JSON.parse(this.b64Utf8(token.split('.')[1]));
    return { email, username, _id, privilege } as User;
  }

  public async login(user: User): Promise<any> {
    return this.userDataService
      .login(user)
      .then((rezultatAvtentikacije: AuthenticationResult) => {
        this.saveToken(rezultatAvtentikacije["token"]);
      });
  }

  public async register(user: User): Promise<any> {
    console.log("authService")
    return this.userDataService
      .register(user)
      .then((rezultatAvtentikacije: AuthenticationResult) => {
        this.saveToken(rezultatAvtentikacije["token"]);
      })
  }

  public logout(): void {
    this.storage.removeItem('SMRPO-token');
  }

  public returnToken(): string {
    return this.storage.getItem('SMRPO-token')! // TODO null assertion !
  }

  public saveToken(token: string): void {
    this.storage.setItem('SMRPO-token', token);
  }

}