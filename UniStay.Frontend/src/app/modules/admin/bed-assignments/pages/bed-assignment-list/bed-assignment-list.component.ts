import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FreeBedGetAllEndpointService } from '../../../../../endpoints/bed-endpoints/free-bed-get-all-endpoint.service';
import { FreeBed } from '../../../../../endpoints/bed-endpoints/free-bed.models';
import { BedAssignmentsFacade } from '../../data/bed-assignments.facade';
import { BedAssignment } from '../../data/bed-assignments.models';
import {
  AssignBedDialogComponent,
  AssignBedDialogData,
  AssignBedDialogResult
} from '../../dialogs/assign-bed-dialog/assign-bed-dialog.component';

@Component({
  selector: 'app-bed-assignment-list',
  standalone: false,
  templateUrl: './bed-assignment-list.component.html',
  styleUrl: './bed-assignment-list.component.scss'
})
export class BedAssignmentListComponent implements OnInit {
  readonly displayedColumns = ['student', 'bed', 'room', 'fromDate', 'toDate', 'actions'];
  readonly dataSource = new MatTableDataSource<BedAssignment>();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!sort) {
      return;
    }

    this.dataSource.sortingDataAccessor = (item: BedAssignment, property: string) => {
      switch (property) {
        case 'student':
          return `${item.studentFirstName} ${item.studentLastName}`.trim();
        case 'fromDate':
        case 'toDate':
          return new Date(item[property]).getTime();
        case 'bed':
          return item.bedNumber;
        case 'room':
          return item.roomNumber;
        default:
          return '';
      }
    };
    this.dataSource.sort = sort;
  }

  constructor(
    public facade: BedAssignmentsFacade,
    private dialog: MatDialog,
    private freeBedsService: FreeBedGetAllEndpointService
  ) {
    effect(() => {
      this.dataSource.data = this.facade.items();
    });
  }

  ngOnInit(): void {
    this.facade.load();
  }

  openAssignDialog(): void {
    this.freeBedsService.getAll().subscribe({
      next: response => this.showAssignDialog(response.items ?? []),
      error: () => this.showAssignDialog([])
    });
  }

  isActive(assignment: BedAssignment): boolean {
    const today = new Date().toISOString().split('T')[0];
    return assignment.fromDate <= today && assignment.toDate >= today;
  }

  private showAssignDialog(freeBeds: FreeBed[]): void {
    const dialogRef = this.dialog.open<
      AssignBedDialogComponent,
      AssignBedDialogData,
      AssignBedDialogResult
    >(AssignBedDialogComponent, {
      width: '520px',
      data: { freeBeds }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.facade.assign({
        bedID: result.bedId,
        studentID: result.studentId,
        fromDate: result.fromDate,
        toDate: result.toDate
      });
    });
  }
}
