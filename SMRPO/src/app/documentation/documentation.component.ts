import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ProjectDataService } from '../project.service';

@Component({
  selector: 'app-documentation',
  templateUrl: `documentation.component.html`,
  styles: [
  ]
})
export class DocumentationComponent implements OnInit {

  constructor(private projectService:ProjectDataService) { }

  @Input() project:string = "";

  selectedFile: File = new File(['test'],'test.txt')
  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      console.log(formData);
      formData.append('file', this.selectedFile);
      debugger
      this.projectService.addDocs(this.project,formData)
      // Send HTTP POST request to upload file
    }
  }
}
