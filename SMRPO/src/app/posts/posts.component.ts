import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../classes/post";
import {PostService} from "../post.service";
import {Project} from "../classes/project";
import {UsersDataService} from "../user.service";
import {User} from "../classes/user";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-posts',
  templateUrl: `posts.component.html`,
  styles: [
  ]
})
export class PostsComponent implements OnInit {
  private editPostError: string = "";
  postsCopy: Post[];

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
            // post.userFirstName = user.firstname
            // post.userLastName = user.lastname
          post.user = user
          }
        ).catch((error) => {this.error = error})
      })
      this.posts = posts
      // this.posts = posts.map(p => ({...p}));
      // this.postsCopy = posts.map(p => ({...p}));
      console.log(this.posts)
    }).catch((error) => {this.error = error})
  }

  editPost(index: number) {
    this.posts[index].isEditing = true;
  }

  onSavePost(form: NgForm, index: number) {
    let post: Post = new Post()
    post._id = this.posts[index]._id
    post.title = form.value.title
    post.content = form.value.content
    post.user = this.posts[index].user
    post.date = new Date()
    this.postService.updatePost(post).then((up_post: Post) => {
      this.posts[index] = up_post
      this.postsCopy[index] = up_post
    }).catch((error) => {this.editPostError = error})
  }

  cancel(index: number) {
    this.posts[index].isEditing = false;
    // this.posts = this.postsCopy.map(p => ({...p}));
  }
}
