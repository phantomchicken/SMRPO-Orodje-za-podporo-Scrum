import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sprint',
  templateUrl: `sprint.component.html`,
  styles: ['.card:hover {box-shadow: 0 0 10px orange;}'
  ]
})
export class SprintComponent implements OnInit {
  sprint: any;
  public error:string ="";

  constructor() { }

  addSprint(): void {
  }

  hide() {
    this.error=""
  }

  ngOnInit(): void {
  }
}
