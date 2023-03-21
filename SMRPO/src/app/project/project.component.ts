import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Project } from '../classes/project';
import { Sprint } from '../classes/sprint';
import { Story } from '../classes/story';
import { User } from '../classes/user';
import { ProjectDataService } from '../project.service';
import { SprintDataService } from '../sprint.service';
import { StoryDataService } from '../story.service';
import { UsersDataService } from '../user.service';

@Component({
  selector: 'app-project',
  templateUrl: `project.component.html`,
  styles: ['.tab-pane:not(.active) > {display: none;}'
  ]
})
export class ProjectComponent implements OnInit {
  public addStoryVisible: boolean = false;
  public addSprintVisible: boolean = false;

  constructor(private route: ActivatedRoute, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService, 
    private storyDataService: StoryDataService, private sprintDataService: SprintDataService) { }
  private routeSub!: Subscription;
  public product_owner_id: string = "" //
  public scrum_master_id: string = ""
  public product_owner: User = new User
  public scrum_master: User = new User
  public developers: User[] = []
  public sprints: Sprint[] = []
  public stories: Story[] = []
  public checkedStories: string[] = []
  public currSprint:Sprint = new Sprint
  public success:boolean = false
  public error:string = ""

  message:string = "";

  update($event: string) {
    if ($event=="story") {
      this.storyDataService.getStories().then((data:Story[])=>{
        this.stories = data.filter(story => story.project === this.project._id);
        console.log(this.stories)
      })
    } else if ($event=="sprint") {
      this.sprintDataService.getSprints().then((data:Sprint[])=>{
        this.sprints = data.filter(sprint => sprint.project === this.project._id);
        console.log(this.sprints)
      })
    }
    
  }

  showAddStory() {
    this.addStoryVisible = true;
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.projectDataService.getProject(params['id']).then((project: Project) => {
        this.project = project;
        this.product_owner_id = project.product_owner.toString()
        this.scrum_master_id = project.scrum_master.toString()
        this.sprintDataService.getSprints().then((data:Sprint[])=>{
          this.sprints = data.filter(sprint => sprint.project === project._id);
          console.log(this.sprints)
        })
        this.storyDataService.getStories().then((data:Story[])=>{
          this.stories = data.filter(story => story.project === project._id);
          console.log(this.stories)
        })
        this.usersDataService.getUser(this.scrum_master_id).then((data:User)=>{
          this.scrum_master = data
        })
        this.usersDataService.getUser(this.product_owner_id).then((data:User)=>{
          this.product_owner = data
        })
        for (var i=0; i<this.project.developers.length; i++){
          this.usersDataService.getUser(this.project.developers[i]).then((data:User)=>{
            this.developers.push(data)
          })
        }
       });
    });
    this.project_ref = this.project._id;
  }

  addStoriesToSprint() {
    // console.log(this.currSprint)
    this.hide()
    for (var i=0; i< this.checkedStories.length; i++){
      var story_id = this.checkedStories[i]
      var curr_story:Story = this.stories.filter((story) => story._id === story_id)[0]; // assumes ID is unique 
      if (curr_story.sprint) this.error = "Story is already assigned to a sprint!" // check if sprint is active
      else {
        curr_story.sprint = this.currSprint._id
        this.storyDataService.updateStory(curr_story)
        this.success = true
      }
    }
  }

  hide() {
    this.error = ""
    this.success = false
  }

  checkStory(id:string, checkedEventTarget:any) {
    if (checkedEventTarget.checked) this.checkedStories.push(id)
    else this.checkedStories = this.checkedStories.filter((storyId) => storyId != id)
    //console.log(id, checkedEventTarget.checked)
    //console.log(this.checkedStories)
  }

  public project: Project = {
    _id: "",
    name: "",
    description: "",
    developers: [], // can have more!
    scrum_master: new User,
    product_owner: new User
  };
  public project_ref: string = "";

  showAddSprint() {
    this.addSprintVisible = true;
  }

  hideAddSprint() {
    this.addSprintVisible = false;
  }

  hideAddStory() {
    this.addStoryVisible = false;
  }
}
