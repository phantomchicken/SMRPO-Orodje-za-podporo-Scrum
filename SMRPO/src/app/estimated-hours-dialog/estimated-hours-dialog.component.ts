import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  taskName: string;
}

@Component({
  selector: 'app-estimated-hours-dialog',
  templateUrl: `estimated-hours-dialog.component.html`,
  styles: [
  ]
})
export class EstimatedHoursDialogComponent implements OnInit {

  estimatedTime: string = '';

  constructor(
      public dialogRef: MatDialogRef<EstimatedHoursDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const regex = /(\d+)h (\d+)m (\d+)s/;
    const match = this.estimatedTime.match(regex);
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
