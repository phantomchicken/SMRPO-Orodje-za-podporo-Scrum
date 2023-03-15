import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { DbService } from '../db.service';

@Component({
  selector: 'app-home',
  template: `
    <p>
      home works!
    </p>
    <div *ngFor="let user of users">
      <p>{{user.firstname}}</p>
    </div>
  `,
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  constructor(private dbService: DbService) { }

  public users: Array<User> | undefined;

  ngOnInit(): void {
    this.dbService.getData().then((data: User[]) => {
      this.users = data;
    })
  }

}
