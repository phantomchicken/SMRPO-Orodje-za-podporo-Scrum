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

  constructor(private route: ActivatedRoute, private taskService: TasksDataService, private sprintService: SprintDataService, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService,
    private storyDataService: StoryDataService) { }
    private routeSub!: Subscription
    public project: Project = new Project()
    public sprint:Sprint = new Sprint()
    public stories:Story[] = []
    public displayedColumns = ['#','description', 'assignee', 'done', 'accepted', 'timeEstimate']; //id
    public storyState = ' '
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
    story.status = "Accepted";
    this.storyDataService.updateStory(story).then(()=>{this.storyState = "accepted"}).catch((error)=>console.error(error))    
  }
  
  rejectStory(story: Story) {
    story.status = "Rejected";
    this.storyDataService.updateStory(story).then(()=>{this.storyState = "Backlog"}).catch((error)=>console.error(error))  
  }
}
