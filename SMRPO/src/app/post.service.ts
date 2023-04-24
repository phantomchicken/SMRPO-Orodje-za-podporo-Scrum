import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage_Browser} from "./classes/storage";
import {environment} from "../environments/environment";
import {Project} from "./classes/project";
import {Post} from "./classes/post";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public addPost(data:any): Promise<Post> {
    console.log(data)
    const url: string = `${this.apiUrl}/db/post/`;
    return this.http
        .post(url, data)
        .toPromise()
        .then(response => response as Post)
        .catch(this.processError);
  }

  public getPost(post: Post): Promise<Post> {
    const url: string = `${this.apiUrl}/db/post/${post._id}`;
    return this.http
        .get(url)
        .toPromise()
        .then(response => response as Post)
        .catch(this.processError);
  }

  public getPosts(): Promise<Post[]> {
    const url: string = `${this.apiUrl}/db/posts`;
    return this.http
        .get(url)
        .toPromise()
        .then(response => response as Post[])
        .catch(this.processError);
  }

  public getPostsByProjectId(project: Project): Promise<Post[]> {
    const url: string = `${this.apiUrl}/db/posts/project/${project._id}`;
    return this.http
        .get(url)
        .toPromise()
        .then(response => response as Post[])
        .catch(this.processError);
  }

  public updatePost(post: Post): Promise<Post> {
    const url: string = `${this.apiUrl}/db/post/${post._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
        .put(url, post, httpLastnosti)
        .toPromise()
        .then(response => response as Project)
        .catch(this.processError);
  }

  public deletePost(post: Post): Promise<void> {
    const url: string = `${this.apiUrl}/db/post/${post._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
        .delete(url, httpLastnosti)
        .toPromise()
        .then()
        .catch(this.processError);
  }

  private processError(napaka: any): Promise<any> {
    return Promise.reject(napaka.error.message || napaka);
  }
}
