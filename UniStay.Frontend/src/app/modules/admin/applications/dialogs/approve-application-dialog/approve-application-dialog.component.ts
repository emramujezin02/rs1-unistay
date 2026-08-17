import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminApplicationListItem } from '../../../../../endpoints/application-endpoints/application.models';
import { FreeBed } from '../../../../../endpoints/bed-endpoints/free-bed.models';

export interface ApproveApplicationDialogData {
  application: AdminApplicationListItem;
  freeBeds: FreeBed[];
}

export interface ApproveApplicationDialogResult {
  bedId: string;
}

@Component({
  selector: 'app-approve-application-dialog',
  standalone: false,
  templateUrl: './approve-application-dialog.component.html'
})
export class ApproveApplicationDialogComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group({
    bedId: ['', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<ApproveApplicationDialogComponent, ApproveApplicationDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ApproveApplicationDialogData
  ) {}

  confirm(): void {
    const bedId = this.form.controls.bedId.value;
    if (this.form.invalid || !bedId) {
      return;
    }
    this.dialogRef.close({ bedId });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
