import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationEndpointService } from '../../../../../endpoints/application-endpoints/application-endpoint.service';
import { AdminApplicationListItem } from '../../../../../endpoints/application-endpoints/application.models';

interface ApplicationDocumentLink {
  name: string;
  fileId: string;
}

@Component({
  selector: 'app-application-detail-dialog',
  standalone: false,
  templateUrl: './application-detail-dialog.component.html',
  styleUrl: './application-detail-dialog.component.scss'
})
export class ApplicationDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApplicationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public application: AdminApplicationListItem,
    private applicationApi: ApplicationEndpointService
  ) {}

  get documents(): ApplicationDocumentLink[] {
    return this.application.documentNames
      ?.split(',')
      .map(document => document.trim())
      .filter(document => !!document)
      .map(document => {
        const [name, fileId] = document.split('|', 2);
        return {
          name: name?.trim() || 'Document',
          fileId: this.normalizeFileId(fileId || name)
        };
      })
      .filter(document => !!document.fileId) ?? [];
  }

  openDocument(document: ApplicationDocumentLink): void {
    this.applicationApi.downloadDocument(this.application.applicationId, document.fileId).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    });
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

  private normalizeFileId(value: string | undefined): string {
    if (!value) {
      return '';
    }

    const trimmed = value.trim();
    try {
      const parsed = new URL(trimmed);
      return parsed.pathname.split('/').filter(Boolean).pop() ?? '';
    } catch {
      return trimmed.replace(/\\/g, '/').split('/').filter(Boolean).pop() ?? '';
    }
  }
}
