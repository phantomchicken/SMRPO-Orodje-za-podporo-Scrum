import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Story} from "../classes/story";
import {Project} from "../classes/project";
import {User} from "../classes/user";
import {Sprint} from "../classes/sprint";
@Component({
  selector: 'app-add-story',
  templateUrl: `add-story.component.html`,
  styles: [
  ]
})
export class AddStoryComponent implements OnInit {

  error: string = "";
  priorityFormControl = new FormControl('white');

  public priorities: String[] = ["MUST HAVE", "COULD HAVE", "SHOULD HAVE", "WON'T HAVE THIS TIME"];


  constructor() { }

  ngOnInit(): void {
  }

  addStory() {

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
    sprint: "",
    assignee: "",
  }


}
