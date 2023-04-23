import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../classes/post";
import {PostService} from "../post.service";
import {Project} from "../classes/project";
import {UsersDataService} from "../user.service";

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

  async ngOnInit(): Promise<void> {
    this.posts = await this.postService.getPostsByProjectId(this.project)
    console.log(this.posts)
    const getUserData = () => {
      this.posts.forEach(async post => {
        post.user = await this.userDataService.getUser(post.user)
      })
    }

    getUserData.call(this);

  }

}
