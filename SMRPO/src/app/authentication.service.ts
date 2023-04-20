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
    const token: string = this.returnToken();
    if (token) {
      const koristnaVsebina = JSON.parse(this.b64Utf8(token.split('.')[1]));
      return koristnaVsebina.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public is_admin():boolean {
    const user:User = this.get_current_user()
    if (user.privilege=="admin")
      return true
    else return false
  }

  public get_current_user(): User {
    if (this.is_logged()) {
      const token: string = this.returnToken();
      const { email, username, _id, privilege, timestamp, login_counter } = JSON.parse(this.b64Utf8(token.split('.')[1]));
      return { email, username, _id, privilege, timestamp, login_counter } as User;
    } else return new User // TODO
  }

  public get_email_from_recover_token(token: string): User {
    const { email, username, _id, privilege } = JSON.parse(this.b64Utf8(token.split('.')[1]));
    return { email, username, _id, privilege } as User;
  }

  public async login(user: User): Promise<any> {
    return this.userDataService
      .login(user)
      .then((rezultatAvtentikacije: AuthenticationResult) => {
        this.saveToken(rezultatAvtentikacije["token"]);
      });
  }

  public async checkPassword(user: User): Promise<any> {
    return this.userDataService
      .login(user)
      .then((rezultatAvtentikacije: AuthenticationResult) => {
        if (rezultatAvtentikacije["token"])
          return true
        else
          return false
      });
  }

  public async register(user: User): Promise<any> {
    return this.userDataService
      .register(user)
      .then((rezultatAvtentikacije: AuthenticationResult) => {
        this.saveToken(rezultatAvtentikacije["token"]);
      })
  }

  public roleForProject(project:any): boolean {
    if (project.scrum_master == this.get_current_user()._id ||
      project.product_owner == this.get_current_user()._id ||
      project.developers.includes(this.get_current_user()._id) || this.is_admin()) return true
    else return false
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

  public email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public validateEmail(email:string): boolean {
    return this.email_regex.test(email)
  }

  public validatePassword(password: string): string {
    var top100: string[] = ["123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon", "123123", "baseball", "abc123", "football", "monkey", "letmein", "696969", "shadow", "master", "666666", "qwertyuiop", "123321", "mustang", "1234567890", "michael", "654321", "pussy", "superman", "1qaz2wsx", "7777777", "fuckyou", "121212", "000000", "qazwsx", "123qwe", "killer", "trustno1", "jordan", "jennifer", "zxcvbnm", "asdfgh", "hunter", "buster", "soccer", "harley", "batman", "andrew", "tigger", "sunshine", "iloveyou", "fuckme", "2000", "charlie", "robert", "thomas", "hockey", "ranger", "daniel", "starwars", "klaster", "112233", "george", "asshole", "computer", "michelle", "jessica", "pepper", "1111", "zxcvbn", "555555", "11111111", "131313", "freedom", "777777", "pass", "fuck", "maggie", "159753", "aaaaaa", "ginger", "princess", "joshua", "cheese", "amanda", "summer", "love", "ashley", "6969", "nicole", "chelsea", "biteme", "matthew", "access", "yankees", "987654321", "dallas", "austin", "thunder", "taylor", "matrix", "minecraft"]
    var error: string = "";
    if (password.length < 12) {
      error += "Password needs to have at least 12 characters!"
    }
    if (password.length > 64) {
      error += "Password can't have more than 64 characters!"
    }
    if (top100.includes(password)) {
      error += "Password must not be trivial (top 100 most popular)!"
    }
    return error
  }

}