import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnnouncementDto } from '../../../../endpoints/announcement-endpoints/announcement.models';

@Component({
  selector: 'app-announcement-detail-dialog',
  standalone: false,
  templateUrl: './announcement-detail-dialog.component.html',
  styleUrl: './announcement-detail-dialog.component.scss'
})
export class AnnouncementDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnnouncementDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public announcement: AnnouncementDto
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
