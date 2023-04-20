import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Sprint } from '../classes/sprint';
import { Story } from '../classes/story';
import { Task } from '../classes/task';
import { ProjectDataService } from '../project.service';
import { SprintDataService } from '../sprint.service';
import { StoryDataService } from '../story.service';
import { UsersDataService } from '../user.service';
import { TasksDataService } from '../task.service';
import { Project } from '../classes/project';

@Component({
  selector: 'app-sprint',
  templateUrl: `sprint.component.html`,
  styles: ['.accepted {background-color: #DFFFE9}', '.rejected {background-color: #FFCCCB}'
  ]
})
export class SprintComponent implements OnInit {
  public addTaskVisible: boolean[] = [];
  showRejectModalFlag: boolean = false
  rejectionComment: string = ""
  selectedStory: Story = new Story()

  constructor(private route: ActivatedRoute, private taskService: TasksDataService, private sprintService: SprintDataService, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService,
    private storyDataService: StoryDataService) { }
    private routeSub!: Subscription
    public project: Project = new Project()
    public sprint:Sprint = new Sprint()
    public stories:Story[] = []
    public displayedColumns = ['#','description', 'assignee', 'done', 'accepted', 'timeEstimate']; //id
    public task:Task = new Task()
    public storyTasksMap = new Map()

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.sprintService.getSprint(params['id']).then((sprint: Sprint) => {
        this.sprint = sprint
        this.storyDataService.getStories().then((data:Story[]) => {
          this.stories = data.filter(story => story.project === sprint.project && story.sprint === sprint._id);
          for (var i=0; i<this.stories.length; i++){
            this.getTasksForStory(this.stories[i])
          } })
        this.projectDataService.getProject(sprint.project).then((
          data:Project) => {
            this.project = data
          })
      })
    })
  }

  public hasSprintEnded(): boolean {
    const endDate = new Date(this.sprint.endDate);
    const currentDate = new Date();
    return endDate < currentDate;
  }

  getTasksForStory(story:Story): void {
    let tasksForStory: Task[] = []
    this.taskService.getTasks().then((data:Task[]) => {
      tasksForStory = data.filter(task => task.story === story._id);
      console.log(tasksForStory);
      this.storyTasksMap.set(story._id,tasksForStory)
      console.log(this.storyTasksMap.get(this.stories[0]._id));
    })
  }

  splitNewLine(str:String){
    return str.split("&~")
  }

  acceptStory(story: Story) {
    story.status = "Accepted"
    story.comment = ""
    this.storyDataService.updateStory(story).then().catch((error)=>console.error(error))    
  }
  
  // Update your TypeScript functions
  showRejectModal(story: Story) {
    this.showRejectModalFlag = true;
    this.rejectionComment = '';
    this.selectedStory = story;
  }

  closeRejectModal() {
    this.showRejectModalFlag = false;
  }

  rejectStory(story: Story) {
    story.status = "Rejected";
    story.comment = this.rejectionComment;
    story.sprint = undefined
    this.storyDataService.updateStory(story).then(() => {
      this.closeRejectModal();
    }).catch((error) => console.error(error));
  }

  showAddTask(i:number) {
    this.addTaskVisible[i] = true;
  }

  hideAddTask(i:number) {
    this.addTaskVisible[i] = false;
  }

  allTasksFinishedForStory(story:Story){
    let tasks: Task[] = this.storyTasksMap.get(story._id)
    return tasks?.length > 0 && tasks.every(task => task.done)
  }

  toggleTask(task:Task, story:Story){
    // TODO if (task.accepted && task.assignee == this.authenticationService.get_current_user()._id) task.done = task.done ? false : true
    if (this.authenticationService.get_current_user()._id == this.project.product_owner.toString() || story.status=='Accepted' || story.status=='Done') return // can't do as product owner, or when story accepted or done but not accepted
    task.done = task.done ? false : true
    this.taskService.updateTask(task).then().catch((error) => console.error(error))
  }

  markDoneStory(story: Story) {
    story.status = 'Done'
    story.comment = '' //??
    this.storyDataService.updateStory(story)
  }

  update($event: string) {
    if ($event=="task") {
      this.stories.forEach(story => {
        this.getTasksForStory(story);
      });
    }
  }
}
