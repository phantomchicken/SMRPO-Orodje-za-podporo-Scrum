import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Story } from './classes/story';
import { Storage_Browser } from './classes/storage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryDataService {
  constructor(private http: HttpClient, @Inject(Storage_Browser) private storage: Storage) { }

  private apiUrl = environment.apiUrl;

  public addStory(data:any): Promise<Story> {
    const url: string = `${this.apiUrl}/db/story`;
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response as Story)
      .catch(this.processError);
  }

  public getStory(id_of_story:any): Promise<Story> {
    const url: string = `${this.apiUrl}/db/story/${id_of_story}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Story)
      .catch(this.processError);
  }

  public updateStory(story: Story): Promise<Story> {
    const url: string = `${this.apiUrl}/db/story/${story._id}`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('SMRPO-token')}`
      })
    };
    return this.http
      .put(url, story, httpLastnosti)
      .toPromise()
      .then(response => response as Story)
      .catch (this.processError);
  }

  public getStories(): Promise<Story[]> {
    const url: string = `${this.apiUrl}/db/stories`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Story[])
      .catch(this.processError);
  }

  public deleteStory(story:Story): Promise<void> {
    const url: string = `${this.apiUrl}/db/story/${story._id}`;
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
