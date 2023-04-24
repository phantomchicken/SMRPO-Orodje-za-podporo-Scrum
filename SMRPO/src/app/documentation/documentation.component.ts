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
  public success: string = "";
  public content?: string | null
  public selectedDoc: string = '';

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
          this.success = "Documentation successfully uploaded!"
          this.error=""
        }).catch((error)=>console.error(error))       
      }).catch((error)=>console.error(error))
    } else {
      this.error ="Please upload a file!"
      this.success = ""
    }
  }

  removeFile(filename:string){
    this.hide()
    this.project.documentation = this.project.documentation.filter(doc => doc !== filename);
    this.projectService.deleteDocs(this.project._id, filename).then(()=>{
      this.projectService.updateProject(this.project).then(()=> {
        this.content = null
        this.success = "Documentation successfully deleted!"
      }).catch((error)=>console.error(error)) 
    }).catch((error)=>console.error(error)) 
    
  }
  
  readFile(filename:string) {
    this.hide()
    this.projectService.fetchFileContent('./assets/'+filename).subscribe(data => {
      // Do something with the content, such as storing it in a variable or displaying it in the template
      this.content = data
    });
  }

  editFile(filename:string){
    this.hide()
    const formData = new FormData();
    formData.append('file', new Blob([this.content!], { type: 'text/plain' }), filename)
    this.projectService.updateDocs(this.project._id, formData).then(()=>{
      this.success = "Documentation successfully updated!"
      this.error=""
    }).catch((error)=>console.error(error)) 
  }


  hide() {
    this.error=""
    this.success=""
  }
}
