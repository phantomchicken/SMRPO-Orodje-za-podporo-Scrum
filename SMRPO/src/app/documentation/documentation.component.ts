import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: `documentation.component.html`,
  styles: [
  ]
})
export class DocumentationComponent implements OnInit {

  constructor() { }

  @Input() project:string = "";


  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
  }

}
