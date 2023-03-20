import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Story} from "../classes/story";
import {StoryDataService} from "../story.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-story',
  templateUrl: `add-story.component.html`,
  styles: [
  ]
})
export class AddStoryComponent implements OnInit {

  error: string = "";
  priorityFormControl = new FormControl('white');

  public priorities: Array<String> = ['Must have', 'Could have', 'Should have', 'Won\'t have this time'];


  constructor(private router: Router,
              private storyService: StoryDataService) { }

  @Input() project:string = "";

  ngOnInit(): void {
    this.story.project = this.project;
  }

  addStory() {
    this.error =""
    this.storyService.addStory(this.story)
        .then((story: Story) => {
          this.error = ""
          console.log('Story added!')
        })
        .catch((error) => {
          console.log(error);
        })
    this.error =""
  }

  hide() {
    this.error = ""
  }

  public story: Story = {
    _id: "",
    name: "",
    description: "",
    storyPoints: -1,
    priority: "",
    acceptanceCriteria: "",
    businessValue: -1,
    status: "",
    project: "",
    sprint: undefined,
    assignee: undefined,
  }

}
