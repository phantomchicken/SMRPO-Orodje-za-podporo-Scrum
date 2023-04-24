import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from "../classes/project";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../post.service";
import {Post} from "../classes/post";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-add-post',
  templateUrl: `add-post.component.html`,
  styles: [
  ]
})
export class AddPostComponent implements OnInit {
  public success: boolean = false;
  public error: string;

  constructor(protected authenticationService: AuthenticationService, private formBuilder: FormBuilder, private postService: PostService) { }
  @Input()
  project: Project;
  postForm: FormGroup;
  title: string =  "";
  content: string = "";

  post: Post;

  sendMessage() {
    this.messageEvent.emit("post")
  }

  @Output() messageEvent = new EventEmitter<string>();
  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }


  onSubmit() {
    let post: Post = new Post()
    post.title = this.postForm.get('title')?.value
    post.content = this.postForm.get('content')?.value
    post.user = this.authenticationService.get_current_user()
    post.project = this.project
    post.date = new Date()
    console.log(post)
    this.postService.addPost(post).then((new_post) =>{
      this.sendMessage()
      }
    ).catch((error) => {
      this.error = error
    })
  }

  hide() {
    this.error = ""
    this.success = false
  }
}
