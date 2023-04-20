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
  public developersString: string[] = []
  public sprints: Sprint[] = []
  public activeSprints: Sprint[] = []
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
        this.hideAddStory() // without hide errors seen, with hide no status report
        console.log("UPDATE STORIES", this.stories)
      })
    } else if ($event=="sprint") {
      this.sprintDataService.getSprints().then((data:Sprint[])=>{
        this.sprints = data.filter(sprint => sprint.project === this.project._id);
        this.activeSprints = this.sprints.filter(sprint => this.colorSprint(sprint)=="bg-success") // if color is green, sprint is active, use it to populate dropdown
        this.sortSprints()
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
          this.activeSprints = this.sprints.filter(sprint => this.colorSprint(sprint)=="bg-success") // if color is green, sprint is active, use it to populate dropdown
          this.sortSprints()
          this.sprints.forEach(sprint => {
            sprint.isEditing = false
          })
          console.log("Sprints", this.sprints)
        })
        this.storyDataService.getStories().then((data:Story[])=>{
          this.stories = data.filter(story => story.project === project._id);
          this.filterStories()
          this.stories.forEach(story => {
            story.isEditing = false
          })
          console.log("Stories", this.stories)
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
            this.developersString.push(data._id)
          })
        }
       });
    });
    this.project_ref = this.project._id;
  }

  filterStories() {
    this.wontHaveStories = this.stories.filter(story => story.priority === "Won't have this time")
    this.finishedStories = this.stories.filter(story => story.status === "Accepted")
    this.unfinishedStories = this.stories.filter(story => story.status !== "Accepted" && story.priority !== "Won't have this time") // won't have goes to won't have not unfinished! 
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
        curr_story.status = "Backlog"
        this.storyDataService.updateStory(curr_story).then(()=>{
          this.update("story")
          //this.filterStories()
          this.success = true
          if (this.success && i==this.checkedStories.length) this.checkedStories = [] // must be in callback because async! cleanup if successful adding and last iteration!
        })
        
      }
    }
    
    
  }

  markDone(story:Story) {
    story.status = 'Done'
    this.storyDataService.updateStory(story)
  }

  checkStory(id:string, checkedEventTarget:any) {
    if (checkedEventTarget.checked) this.checkedStories.push(id)
    else this.checkedStories = this.checkedStories.filter((storyId) => storyId != id)
    //console.log(id, checkedEventTarget.checked)
    //console.log(this.checkedStories)
  }

  deleteStoryBtn(story:Story){
    console.log("deleting story")
    this.storyDataService.deleteStory(story).then(()=> this.update("story")).catch((error) => {console.log(error)})
    
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
    let startDate = new Date(this.sprints[index].startDate);
    let endDate = new Date(this.sprints[index].endDate);
    let velocity = this.sprints[index].velocity;
    let newStartDate = new Date(form.value.startDate);
    let newEndDate = new Date(form.value.endDate);
    let newVelocity = form.value.velocity;
    if (startDate.getDate() === newStartDate.getDate()
        && endDate.getDate() === newEndDate.getDate()
        && velocity == newVelocity){
      this.sprints[index].isEditing = false;
    }
    else{
      this.updateSprint(index, this.sprints[index], newStartDate, newEndDate, newVelocity)
    }
  }

  onStoryEditSubmit(form: NgForm, id: string) {
    let index = this.stories.findIndex((story) => story._id == id)
    let priority = this.stories[index].priority;
    let businessValue = this.stories[index].businessValue;
    let acceptanceCriteria = this.stories[index].acceptanceCriteria;
    let newPriority = form.value.priority
    let newBusinessValue = form.value.businessValue
    let newAcceptanceCriteria = form.value.velocity;
    if (priority === newPriority
        && businessValue === newBusinessValue
        && acceptanceCriteria == newAcceptanceCriteria){
      this.stories[index].isEditing = false;
    }
    else{
      this.storyDataService.updateStory(this.stories[index])
    }

    this.stories[index].isEditing = false;
  }

  editSprint(index: number) {
    // let sprintIndex:number = this.getSprintIndexById(sprintId);
    this.sprints[index].isEditing = true;
    // console.log(this.sprints[sprintIndex])
  }

  editStory(id: string){
    let ix = this.stories.findIndex((story) => story._id == id)
    console.log(id, ix, this.stories);
    this.stories[ix].isEditing = true;
  }

  cancelEditSprint(index: number) {
    this.sprints[index].isEditing = false;
    this.sprints[index].update_error = "";
  }

  cancelEditStory(id: string) {
    let index = this.stories.findIndex((story) => story._id == id)
    this.stories[index].isEditing = false;
  }

  getSprintDate(sprintId:string) {
    let res = []
    let sprint = this.sprints.find((sprint)=>sprint._id == sprintId)
    res[0] = sprint?.startDate, res[1] = sprint?.endDate
    return res
  }

  sortSprints(){ // sort sprints by descending date
    this.sprints.sort((a: Sprint, b: Sprint) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });
  }

  colorSprint(sprint: Sprint): string{ // past sprints are grey, current green, future dark blue
    var today = new Date().toISOString()
    if (sprint.startDate.toString() < today && (today < sprint.endDate.toString() || today.substring(0,10) == sprint.endDate.toString().substring(0,10))) { // primitive check if same day
      return "bg-success"
    } else if (sprint.startDate.toString() < today && sprint.endDate.toString() < today) {
      return "bg-secondary"
    } else   //(sprint.startDate < today && sprint.endDate < today) {
      return "bg-info"
  }

  deleteSprint(index:number, sprint:Sprint): void {
    this.sprintDataService.deleteSprint(sprint).then(() => {
      let storiesOfSprint = this.stories.filter((story) => story.project == sprint.project && story.sprint == sprint._id)
      for (var i=0; i<storiesOfSprint.length; i++) {
        this.storyDataService.deleteStory(storiesOfSprint[i]).then(()=> this.update("story")).catch((error) => {console.log(error)}) // TODO: delete all stories of sprint needed?
      }
      this.update("sprint")
    }).catch((error) => {
      console.log(error);
      this.sprints[index].update_error = this.error
    })
  }

  @Output() messageEvent = new EventEmitter<string>();
  sendMessage() {
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

    const setError = (error: string, updated: boolean): void => {
      this.sprints[index].update_error = error;
      this.sprints[index].isEditing = false;
      this.sprints[index].updated = updated;
    };

    if (this.colorSprint(sprint) === 'bg-success') { // for active sprints we can only change velocity
      if (!newVelocity) this.sprints[index].update_error = "Please enter velocity!"
      else if (isNaN(+newVelocity) || newVelocity < 0 || newVelocity > 100) { // newVelocity is new value
        setError("Sprint velocity must be a number between 1 and 100!", false);
      } else {
        sprint.velocity = newVelocity;
        this.sprintService.updateSprint(sprint)
          .then(() => {
            this.success = true;
            setError("", true);        
          })
          .catch((error) => {
            setError(error.error, false);
            console.error(error);
          });
      }
      return;
    }

    if (!sprint.startDate || !sprint.endDate || !newVelocity) {
      this.sprints[index].update_error = "Please enter all fields!"
    } else if (sDate.getTime() > eDate.getTime()){
      this.sprints[index].update_error = "Sprint ends before it starts!"
    } else if (sDate.getTime() < today.getTime()){
      this.sprints[index].update_error = "Sprint starts before today!"
    } else if (isNaN(+newVelocity) || newVelocity < 0 || newVelocity > 100){ // newVelocity is new value
      this.sprints[index].update_error = "Sprint velocity must be a number between 1 and 100!"
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
                    this.sprints[index].isEditing = false;
                    this.sprints[index].updated = true;
                    console.log('Sprint updated!');
                    this.sortSprints() // sort immediately on edit or on refresh?
                  })
                  .catch((error) => {
                    this.sprints[index].update_error = error.error;
                    this.sprints[index].isEditing = false;
                    this.sprints[index].updated = false;
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
