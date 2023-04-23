import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../classes/post";
import {PostService} from "../post.service";
import {Project} from "../classes/project";
import {UsersDataService} from "../user.service";
import {User} from "../classes/user";

@Component({
  selector: 'app-posts',
  templateUrl: `posts.component.html`,
  styles: [
  ]
})
export class PostsComponent implements OnInit {

  constructor(private postService: PostService, private userDataService: UsersDataService) { }

  @Input() project:Project = new Project();


  @Output() messageEvent = new EventEmitter<string>();
  posts: Post[];

  error: string = ""

  ngOnInit(): void {
    this.postService.getPostsByProjectId(this.project).then((posts: Post[]) =>{
      console.log(this.posts)
      posts.forEach(async post => {
        this.userDataService.getUser(post.user).then((user:User) => {
            post.user = user
          }
        ).catch((error) => {this.error = error})
      })
      this.posts = posts
    }).catch((error) => {this.error = error})
  }

}
