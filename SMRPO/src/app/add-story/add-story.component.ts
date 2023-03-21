import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  
  @Output() messageEvent = new EventEmitter<string>();
  sendMessage() {
    console.log("send message")
    this.messageEvent.emit("story")
  }

  ngOnInit(): void {
    this.story.project = this.project;
    this.error =""
    this.success=false
  }

  addStory() {
    this.error =""
    this.success=false
    if (!this.story.name || !this.story.description || !this.story.description || !this.story.priority || !this.story.businessValue || !this.story.acceptanceCriteria) {
      this.error = "Please enter all fields!"
    } else if (isNaN(+this.story.businessValue) || this.story.businessValue<1 || this.story.businessValue>10) {
      this.error = "Please make sure business value is a number between 1 and 10!"
    } else {
      let overlap = false
      this.storyService.getStories().then((stories:Story []) => { // get all stories and check for same name only for those concerning the same project
        for (var i=0;i<stories.length;i++) {
          if (stories[i].project == this.project) {
            if (stories[i].name == this.story.name) {
              this.error = "Story with this name already exists!"
              overlap = true
              break
            }
          }
        }
        if (!overlap) {
          this.storyService.addStory(this.story)
        .then((story: Story) => {
          this.success = true;
          this.error = ""
          console.log('Story added!')
          this.sendMessage()
        })
        .catch((error) => {
          if (error.error.code==11000) this.error = "Story with this name already exists!";
          else console.error(error);
        })
        }
      })
    }
    
  }

  hide() {
    this.error = ""
    this.success = false
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
  public success:boolean = false;

}
