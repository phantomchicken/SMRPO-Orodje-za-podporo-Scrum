import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-project',
  templateUrl: `add-project.component.html`,
  styles: [ 
  ]
})
export class AddProjectComponent implements OnInit {

  constructor() { }
  public error:string ="";
  
  public hide():void{
    this.error=""
  }

  addProject(): void { //TODO: error checking and BE
    if (!this.project.name || !this.project.description || !this.project.scrum_master || !this.project.product_owner || !this.project.developers) {
      this.error = "Please enter all fields!"
    } else if (this.project.scrum_master == this.project.product_owner) {
      this.error = "Scrum master and product owner can't be the same person!"
    }
  }

  ngOnInit(): void {
  }

  public project: any = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: "",
    product_owner: ""
  };

}
