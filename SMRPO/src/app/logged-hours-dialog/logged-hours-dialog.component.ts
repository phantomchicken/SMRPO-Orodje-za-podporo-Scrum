import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface LoggedDialogData {
  taskName: string;
  editedTime: string;
}

@Component({
  selector: 'app-logged-hours-dialog',
  templateUrl: `logged-hours-dialog.component.html`,
  styles: [
  ]
})
export class LoggedHoursDialogComponent implements OnInit {

  editedTime: any;

  constructor(
      public dialogRef: MatDialogRef<LoggedHoursDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: LoggedDialogData
  ) {
    this.editedTime = data.editedTime;
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const regex = /(\d+)h (\d+)m (\d+)s/;
    const match = this.editedTime.match(regex);
    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      const seconds = Number(match[3]);
      this.dialogRef.close({ hours, minutes, seconds });
    } else {
      alert('Please enter a valid estimated time in format "1h 1m 1s"');
    }
  }

  get taskName(): string {
    return this.data.taskName;
  }

}
