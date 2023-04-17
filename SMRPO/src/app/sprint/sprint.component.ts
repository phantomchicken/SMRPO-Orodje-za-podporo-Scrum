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
  styles: [
  ]
})
export class SprintComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TasksDataService, private sprintService: SprintDataService, private projectDataService: ProjectDataService, private usersDataService: UsersDataService, protected authenticationService: AuthenticationService,
    private storyDataService: StoryDataService) { }
    private routeSub!: Subscription
    public project: Project = new Project()
    public sprint:Sprint = new Sprint()
    public stories:Story[] = []
    public dataSource: MatTableDataSource<string> = new MatTableDataSource()
    public displayedColumns = ['#','description', 'assignee', 'done']; //id
    public storyState = ' '

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.sprintService.getSprint(params['id']).then((sprint: Sprint) => {
        this.sprint = sprint
        this.storyDataService.getStories().then((data:Story[]) => {
          this.stories = data.filter(story => story.project === sprint.project && story.sprint === sprint._id);
          this.dataSource = new MatTableDataSource(["place", "holder"]); //TODO change so data source uses getTasksForStoryFunction
        })
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

  getTasksForStory(story:Story): Task[] {
    let tasksForStory: Task[] = []
    this.taskService.getTasks().then((data:Task[]) => {
      tasksForStory = data.filter(task => task.story === story._id);
      console.log(tasksForStory)    
    })
    return tasksForStory
  }

  splitNewLine(str:String){
    return str.split("&~")
  }

  acceptStory(story: Story) {
    story.status = "Done";
    this.storyState = "accepted"
  }
  
  rejectStory(story: Story) {
    story.status = "Backlog";
    this.storyState = "rejected"
  }
}
