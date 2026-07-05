import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FreeBed } from '../../../../../endpoints/bed-endpoints/free-bed.models';
import { UserGetAllEndpointService } from '../../../../../endpoints/user-endpoints/user-get-all-endpoint.service';
import { UserListItem } from '../../../../../endpoints/user-endpoints/user.models';

export interface AssignBedDialogData {
  freeBeds: FreeBed[];
}

export interface AssignBedDialogResult {
  bedId: number;
  studentId: number;
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-assign-bed-dialog',
  standalone: false,
  templateUrl: './assign-bed-dialog.component.html',
  styleUrl: './assign-bed-dialog.component.scss'
})
export class AssignBedDialogComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UserGetAllEndpointService);

  readonly freeBeds: FreeBed[];
  readonly studentControl = new FormControl<UserListItem | string>('');
  readonly form = this.formBuilder.group({
    bedId: [null as number | null, Validators.required],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });

  filteredStudents: UserListItem[] = [];
  loadingStudents = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AssignBedDialogComponent, AssignBedDialogResult>,
    @Inject(MAT_DIALOG_DATA) data: AssignBedDialogData
  ) {
    this.freeBeds = data.freeBeds ?? [];
  }

  get selectedStudent(): UserListItem | null {
    const value = this.studentControl.value;
    return value && typeof value === 'object' ? value : null;
  }

  ngOnInit(): void {
    this.searchStudents('');
    this.studentControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (typeof value === 'string') {
        this.searchStudents(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayStudent(user: UserListItem | string | null): string {
    if (!user || typeof user === 'string') {
      return user ?? '';
    }

    return `${user.firstName} ${user.lastName} (${user.username})`;
  }

  confirm(): void {
    if (this.form.invalid || !this.selectedStudent) {
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      bedId: value.bedId!,
      studentId: this.selectedStudent.id,
      fromDate: value.fromDate!,
      toDate: value.toDate!
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private searchStudents(term: string): void {
    this.loadingStudents = true;
    this.usersService.getAll({ q: term, pageNumber: 1, pageSize: 50 }).subscribe({
      next: response => {
        this.filteredStudents = (response.items ?? []).filter(user =>
          !user.roleName || user.roleName.toLowerCase() === 'student'
        );
        this.loadingStudents = false;
      },
      error: () => {
        this.filteredStudents = [];
        this.loadingStudents = false;
      }
    });
  }
}
