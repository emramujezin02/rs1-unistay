import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminApplicationListItem } from '../../../../../endpoints/application-endpoints/application.models';

@Component({
  selector: 'app-application-detail-dialog',
  standalone: false,
  templateUrl: './application-detail-dialog.component.html',
  styleUrl: './application-detail-dialog.component.scss'
})
export class ApplicationDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplicationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public application: AdminApplicationListItem
  ) {}

  get documents(): string[] {
    return this.application.documentNames
      ?.split(',')
      .map(document => document.trim())
      .filter(document => !!document) ?? [];
  }

  statusColor(): string {
    if (this.application.status === 'Approved') {
      return 'primary';
    }
    if (this.application.status === 'Rejected') {
      return 'warn';
    }
    return 'accent';
  }

  close(): void {
    this.dialogRef.close();
  }
}
