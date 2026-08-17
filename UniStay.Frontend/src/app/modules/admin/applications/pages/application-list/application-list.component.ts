import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminApplicationListItem } from '../../../../../endpoints/application-endpoints/application.models';
import { FreeBedGetAllEndpointService } from '../../../../../endpoints/bed-endpoints/free-bed-get-all-endpoint.service';
import { FreeBed } from '../../../../../endpoints/bed-endpoints/free-bed.models';
import { ApplicationsFacade } from '../../data/applications.facade';
import { ApplicationDetailDialogComponent } from '../../dialogs/application-detail-dialog/application-detail-dialog.component';
import {
  ApproveApplicationDialogComponent,
  ApproveApplicationDialogData,
  ApproveApplicationDialogResult
} from '../../dialogs/approve-application-dialog/approve-application-dialog.component';

@Component({
  selector: 'app-application-list',
  standalone: false,
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss'
})
export class ApplicationListComponent implements OnInit {
  readonly displayedColumns = ['student', 'academic', 'room', 'documents', 'notes', 'status', 'appliedAt', 'actions'];
  readonly statuses = ['', 'Pending', 'Approved', 'Rejected'];
  readonly dataSource = new MatTableDataSource<AdminApplicationListItem>();
  selectedStatus = '';

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    public facade: ApplicationsFacade,
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

  showDetails(application: AdminApplicationListItem, event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    this.dialog.open(ApplicationDetailDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: application
    });
  }

  approve(application: AdminApplicationListItem, event: MouseEvent): void {
    event.stopPropagation();
    this.freeBedsService.getAll().subscribe({
      next: response => this.openApproveDialog(application, response.items ?? []),
      error: () => this.openApproveDialog(application, [])
    });
  }

  reject(application: AdminApplicationListItem, event: MouseEvent): void {
    event.stopPropagation();
    this.facade.reject(application.applicationId);
  }

  statusColor(status: string): string {
    return status === 'Approved' ? 'primary' : status === 'Rejected' ? 'warn' : 'accent';
  }

  private openApproveDialog(application: AdminApplicationListItem, freeBeds: FreeBed[]): void {
    const dialogRef = this.dialog.open<
      ApproveApplicationDialogComponent,
      ApproveApplicationDialogData,
      ApproveApplicationDialogResult
    >(ApproveApplicationDialogComponent, {
      width: '500px',
      data: { application, freeBeds }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.bedId) {
        this.facade.approve(application.applicationId, result.bedId);
      }
    });
  }
}
