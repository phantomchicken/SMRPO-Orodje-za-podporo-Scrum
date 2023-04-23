import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../classes/post";
import {User} from "../classes/user";

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
  posts: Post[];

  ngOnInit(): void {
  }

}
