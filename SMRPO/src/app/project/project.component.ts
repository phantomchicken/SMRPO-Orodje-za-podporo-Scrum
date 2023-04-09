import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {NgForm} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-project',
  templateUrl: `project.component.html`,
  styles: ['.tab-pane:not(.active) > {display: none;}'
  ]
})
export class ProjectComponent implements OnInit {
  public addStoryVisible: boolean = false;
  public addSprintVisible: boolean = false;

  constructor(private route: ActivatedRoute, private sprintService: SprintDataService, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService,
    private storyDataService: StoryDataService, private sprintDataService: SprintDataService, private datePipe: DatePipe) { }
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
  public update_error:string = ""
  public error:string = ""

  public wontHaveStories: Story[] = []
  public unfinishedStories: Story[] = []
  public finishedStories: Story[] = []
  remVel:number = 0
  message:string = "";

  update($event: string) {
    if ($event=="story") {
      this.storyDataService.getStories().then((data:Story[])=>{
        this.stories = data.filter(story => story.project === this.project._id);
        this.filterStories()
        console.log("UPDATE STORIES", this.stories)
      })
    } else if ($event=="sprint") {
      this.sprintDataService.getSprints().then((data:Sprint[])=>{
        this.sprints = data.filter(sprint => sprint.project === this.project._id);
        console.log("UPDATE SPRINTS", this.sprints)
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
          this.sprints.forEach(sprint => {
            sprint.isEditing = false
          })
          console.log(this.sprints)
        })
        this.storyDataService.getStories().then((data:Story[])=>{
          this.stories = data.filter(story => story.project === project._id);
          this.filterStories()
          console.log(this.stories)
        })
        this.usersDataService.getUser(this.scrum_master_id).then((data:User)=>{
          this.scrum_master = data
          console.log(data);
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
    console.log(this.scrum_master_id);
  }

  filterStories() {
    this.wontHaveStories = this.stories.filter(story => story.priority === "Won't have this time")
    this.finishedStories = this.stories.filter(story => story.status === "Done")
    this.unfinishedStories = this.stories.filter(story => story.status !== "Done" && story.priority !== "Won't have this time") // won't have goes to won't have not unfinished! 
  }

  addStoriesToSprint() {
    this.hide()
    for (var i=0; i< this.checkedStories.length; i++){
      var story_id = this.checkedStories[i]
      var curr_story:Story = this.stories.filter((story) => story._id === story_id)[0]; // assumes ID is unique 
      if (curr_story.sprint) this.error = "Story is already assigned to a sprint!" // check if sprint is active
      else if (this.remVel-(+curr_story.storyPoints!)<0) this.error = "Story is too long for sprint!" // check if sprint has enough remaining velocity
      else {
        this.remVel -= +curr_story.storyPoints!
        curr_story.sprint = this.currSprint._id
        this.storyDataService.updateStory(curr_story)
        this.success = true
      }
    }
    if (this.success) this.checkedStories = [] // cleanup if successful adding!
  }

  checkStory(id:string, checkedEventTarget:any) {
    if (checkedEventTarget.checked) this.checkedStories.push(id)
    else this.checkedStories = this.checkedStories.filter((storyId) => storyId != id)
    //console.log(id, checkedEventTarget.checked)
    //console.log(this.checkedStories)
  }

  editStoryPoints(story:Story, newStoryPoints:any){
    if (!isNaN(+newStoryPoints.value) && newStoryPoints.value>0) {
      story.storyPoints = newStoryPoints.value
      this.storyDataService.updateStory(story)
      this.update_error = ""
    } else {
      this.update_error="Story points must be a positive number!"
      newStoryPoints.value = story.storyPoints
    }
  }

  getCheckedStoryPoints(): number {
    let sum:number = 0;
    for (var i=0; i< this.checkedStories.length; i++) {
      var curr_story:Story = this.stories.filter((story) => story._id === this.checkedStories[i])[0];
      sum += (+curr_story.storyPoints!)
    }
    return sum;
  }

  calculateRemainingVelocity(sprint:Sprint): number {
    var sprintStories:Story[] = this.stories.filter((story) => story.sprint === sprint._id)
    this.remVel = sprint.velocity
    for (var i=0; i<sprintStories.length; i++){
      this.remVel -= (+sprintStories[i].storyPoints!)
    }
    return this.remVel
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

  hide() {
    this.error = ""
    this.success = false
  }

  updated_message_hide(index:number){
    this.sprints[index].updated = false;
  }

  updated_error_hide(index:number){
    this.sprints[index].update_error = "";
  }
  
  showAddSprint() {
    this.addSprintVisible = true;
  }

  hideAddSprint() {
    this.addSprintVisible = false;
  }

  hideAddStory() {
    this.addStoryVisible = false;
  }

  splitNewLine(str:String){
    return str.split("&~")
  }

  getSprintIndexById(sprintId: string): any {
    this.sprints.forEach(sprint => {
      console.log(sprint._id)
      console.log(sprint._id == sprintId)
      if (sprint._id == sprintId){
        return sprint;
      }
    return null
    });
  }

  onSprintEditSubmit(form: NgForm, index: number) {

    this.updateSprint(index, this.sprints[index], form.value.startDate, form.value.endDate, form.value.velocity)
  }

  editSprint(index: number) {
    // let sprintIndex:number = this.getSprintIndexById(sprintId);
    this.sprints[index].isEditing = true;
    // console.log(this.sprints[sprintIndex])
  }

  cancelEditSprint(index: number) {
    this.sprints[index].isEditing = false;
    this.sprints[index].update_error = "";
  }

  @Output() messageEvent = new EventEmitter<string>();
  sendMessage() {
    console.log("send message")
    this.messageEvent.emit("sprint")
  }

  updateSprint(index: number, sprint: Sprint, newStartDate: Date, newEndDate: Date, newVelocity: number): void {
    let todayDate = new Date()
    let startDate = new Date(newStartDate)
    let endDate = new Date(newEndDate)

    let today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()))
    let sDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()))
    let eDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))

    if (sDate.getDay() === 6 || sDate.getDay() === 0){
      this.sprints[index].update_error = "Sprint must not start at weekend!"
      return
    }

    if (eDate.getDay() === 6 || eDate.getDay() === 0){
      this.sprints[index].update_error = "Sprint must not end at weekend!"
      return
    }

    if (!sprint.startDate || !sprint.endDate || !sprint.velocity) {
      this.sprints[index].update_error = "Please enter all fields!"
    } else if (sDate.getTime() > eDate.getTime()){
      this.sprints[index].update_error = "Sprint ends before it starts!"
    } else if (sDate.getTime() < today.getTime()){
      this.sprints[index].update_error = "Sprint starts before today!"
    }else if (isNaN(+sprint.velocity) || sprint.velocity < 0 || sprint.velocity > 100){
      this.sprints[index].update_error = "Sprint velocity is invalid!"
    } else{
      // add backend call
      let overlap = false
      this.sprintService.getSprints()
          .then((sprints: Sprint[]) => {
            for (var i=0; i < sprints.length; i++){
              if (sprints[i].project == this.project._id && sprints[i]._id != sprint._id) { // get all sprints and check for overlap only for those concerning the same project
                let s_i = new Date(sprints[i].startDate)
                let e_i = new Date(sprints[i].endDate)
                if ((sDate.getTime() >= s_i.getTime() && sDate.getTime() <= e_i.getTime())
                    || (eDate.getTime() >= s_i.getTime() && eDate.getTime() <= e_i.getTime())
                    || (s_i.getTime() >= sDate.getTime() && s_i.getTime() <= eDate.getTime())
                    || (e_i.getTime() >= sDate.getTime() && e_i.getTime() <= eDate.getTime())){
                  this.sprints[index].update_error = "Sprint overlaps with an existing sprint!"
                  overlap = true
                  break
                }
              }
            }
            if (!overlap) {
              sprint.startDate = newStartDate;
              sprint.endDate = newEndDate;
              sprint.velocity = newVelocity;
              this.sprintService.updateSprint(sprint)
                  .then((sprint: Sprint) => {
                    this.success = true;
                    this.sprints[index].update_error = "";
                    this.sendMessage()
                    this.sprints[index].isEditing = false;
                    this.sprints[index].updated = true;
                    console.log('Sprint updated!');
                  })
                  .catch((error) => {
                    this.sprints[index].update_error = error;
                    console.error(error);
                  });
            }
          })
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
