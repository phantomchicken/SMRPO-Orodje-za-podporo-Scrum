import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Project } from '../classes/project';
import { ProjectDataService } from '../project.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-documentation',
  templateUrl: `documentation.component.html`,
  styles: [
  ]
})
export class DocumentationComponent implements OnInit {
  public error: string = "";
  public success: boolean = false;

  constructor(private projectService:ProjectDataService, private http: HttpClient) { }

  @Input() project:Project = new Project

  selectedFile: File | undefined
  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    this.hide()
    if (this.selectedFile != undefined) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.projectService.addDocs(this.project._id,formData).then(()=>{
        this.project.documentation.push(this.selectedFile!.name)
        this.projectService.updateProject(this.project).then(()=> {
          this.success = true
          this.error=""
        }).catch((error)=>console.error(error))       
      }).catch((error)=>console.error(error))
    } else {
      this.error ="Please upload a file!"
      this.success = false
    }
  }

  downloadFile() {
    this.projectService.readDocs(this.project._id,"test.txt")
  }
  
  public downloadFile2() {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = 'http://localhost:3000/api/assets/test.txt'; // Use the absolute path to the assets folder in your Angular project
    link.download = 'test.txt'; // Update with the desired filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  f1() {
    window.open('http://localhost:3000/api/assets/test.txt', '_blank');
 }
  

  hide() {
    this.error=""
    this.success=false
  }
}
