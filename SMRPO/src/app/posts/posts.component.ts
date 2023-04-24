import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../classes/post";
import {PostService} from "../post.service";
import {Project} from "../classes/project";
import {UsersDataService} from "../user.service";
import {User} from "../classes/user";
import {NgForm} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-posts',
  templateUrl: `posts.component.html`,
  styles: [
  ]
})
export class PostsComponent implements OnInit {
  private editPostError: string = "";
  postsCopy: Post[];
  success: boolean;

  constructor(protected authenticationService: AuthenticationService, private postService: PostService, private userDataService: UsersDataService) { }

  @Input() project:Project = new Project();


  @Output() messageEvent = new EventEmitter<string>();
  posts: Post[];

  error: string = ""
  addPostVisible: boolean = false;

  ngOnInit(): void {
    this.getProjectPosts();
  }

  private getProjectPosts() {
    this.postService.getPostsByProjectId(this.project).then((posts: Post[]) => {
      this.posts = posts.map(p => ({...p}));
      this.postsCopy = posts.map(p => ({...p}));
      this.posts.forEach(post => {
        this.getUser(post)
      })
      this.postsCopy.forEach(post => {
        this.getUser(post)
      })
      this.sortPostsByDate(this.posts)
      this.sortPostsByDate(this.postsCopy)
      console.log(this.posts)
    }).catch((error) => {
      this.error = error
    })
  }

  getUser(post: Post) {
    this.userDataService.getUser(post.user).then((user: User) => {
          post.user = user
        }
    ).catch((error) => {
      this.error = error
    })
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
      this.getUser(this.posts[index])
      this.postsCopy[index] = up_post
      this.getUser(this.postsCopy[index])
      this.sortPostsByDate(this.posts)
      this.sortPostsByDate(this.postsCopy)
    }).catch((error) => {this.editPostError = error})
  }

  cancel(index: number) {
    this.posts[index].isEditing = false;
    this.getProjectPosts();
  }

  deletePost(i: number) {
    console.log(this.posts[i])
    this.postService.deletePost(this.posts[i]).then(() => {
      this.getProjectPosts();
    }).catch((error) =>{
          console.log(error);
          this.posts[i].deleteError = error;
      }
    )
  }

  sortPostsByDate(posts: Post[]): Post[] {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  showAddPost() {
    this.addPostVisible = true
  }

  hideAddPost() {
    this.addPostVisible = false
  }

  update($event: string) {
    if ($event == "post"){
      this.success = true;
      this.getProjectPosts();
      this.hideAddPost()
    }
  }

  hide() {
    this.success = false
  }

}
