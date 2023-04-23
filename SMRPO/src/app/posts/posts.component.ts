import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: `posts.component.html`,
  styles: [
  ]
})
export class PostsComponent implements OnInit {

  constructor() { }

  @Input() project:string = "";


  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
  }

}
