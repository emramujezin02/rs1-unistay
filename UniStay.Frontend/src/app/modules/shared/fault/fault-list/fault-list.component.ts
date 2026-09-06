import { Component, OnInit } from '@angular/core';
import { FaultGetAllEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-all-endpoint.service';
import { FaultDeleteEndpointService } from '../../../../endpoints/fault-endpoints/fault-delete-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FaultUpdateEndpointService } from '../../../../endpoints/fault-endpoints/fault-update-endpoint.service';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { trigger,transition,style,animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Fault } from '../../../../endpoints/fault-endpoints/fault-get-by-id-endpoint.service';
@Component({
  selector: 'app-fault-list',
  templateUrl: './fault-list.component.html',
  styleUrls: ['./fault-list.component.scss'],
  standalone:false,
    animations: [ 
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('1000ms ease',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class FaultListComponent implements OnInit {
  faults: Fault[] = [];
  filteredFaults: Fault[] = [];
  pagedFaults: Fault[] = [];
  readonly pageSizeOptions = [5, 10, 20];
  currentPage = 1;
  pageSize = 10;
  displayedColumns:string[]=['title','reportedBy','description','isResolved','reportedAt', 'resolvedAt', 'actions'];
    @ViewChild(MatSort) set matSort(sort:MatSort){
    if(sort){
      this.sort=sort;
      this.sort.sortChange.subscribe(()=>{
        this.sortData();
      })
    }
  }
  sort!:MatSort;
  filters = {
    title: '',
    reportedBy: '',
    isResolved: '',
    from: '',
    to:''
  };

  loading = false;

  constructor(
    private faultGetAllService: FaultGetAllEndpointService,
    private faultDeleteService: FaultDeleteEndpointService,
    private faultUpdateService:FaultUpdateEndpointService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFaults();
  }

  loadFaults(): void {
    this.loading = true;
    this.faultGetAllService.getAllFaults().subscribe({
      next: (res: Fault[]) => {
        this.faults = res;
        this.filteredFaults = [...res];
        this.currentPage = 1;
        this.updatePagedFaults();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading faults', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }

applyFilters() {
    this.currentPage = 1;
    this.filteredFaults = this.faults.filter(f => {
      const matchesTitle =
        !this.filters.title ||
        f.title.toLowerCase().includes(this.filters.title.toLowerCase());

      const matchesReportedBy =
        !this.filters.reportedBy ||
        (f.reportedByName || f.reportedByUserName || '')
          .toLowerCase()
          .includes(this.filters.reportedBy.toLowerCase());

      const matchesIsResolved =
        this.filters.isResolved === '' ||
        String(f.isResolved) === this.filters.isResolved;

      const matchesFrom =
        !this.filters.from ||
        new Date(f.reportedAt) >= new Date(this.filters.from);

      const matchesTo =
        !this.filters.to ||
        new Date(f.reportedAt) <= new Date(this.filters.to);

      return matchesTitle && matchesReportedBy && matchesIsResolved && matchesFrom && matchesTo;
    });
    this.sortData();
    this.updatePagedFaults();
  }

  clearFilters(): void {
    this.filters = { title: '', reportedBy: '', isResolved: '', from: '', to: '' };
    this.filteredFaults = [...this.faults];
    this.currentPage = 1;
    this.sortData();
    this.updatePagedFaults();
  }

  deleteFault(id: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this fault?' }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.faultDeleteService.deleteFault(id).subscribe({
        next: () => {
          this.snackBar.open('Fault deleted', 'OK', { duration: 3000 });
          this.loadFaults();
        },
        error: (err) => {
          console.error("Backend error: ",err);
          this.snackBar.open('Error deleting', 'OK', { duration: 3000 });}
      });
    });
  }

  updateFault(id: number): void {
this.router.navigate(['../fault-add', id], { relativeTo: this.route });
  }

  addFault(): void {
    this.router.navigate(['../fault-add'], { relativeTo: this.route });
  }

  sortData() {

  if (!this.sort || !this.sort.active || this.sort.direction === '') {
    return;
  }

  const isAsc = this.sort.direction === 'asc';

  this.filteredFaults = [...this.filteredFaults].sort((a, b) => {

    switch (this.sort.active) {

      case 'title':
        return this.compare(
          a.title?.toLowerCase(),
          b.title?.toLowerCase(),
          isAsc
        );

      case 'reportedBy':
        return this.compare(
          (a.reportedByName || a.reportedByUserID)?.toString().toLowerCase(),
          (b.reportedByName || b.reportedByUserID)?.toString().toLowerCase(),
          isAsc
        );

      case 'isResolved':
        return this.compare(
          a.isResolved,
          b.isResolved,
          isAsc
        );

      case 'reportedAt':
        return this.compare(
          new Date(a.reportedAt).getTime(),
          new Date(b.reportedAt).getTime(),
          isAsc
        );

      case 'resolvedAt':
        return this.compare(
          a.resolvedAt ? new Date(a.resolvedAt).getTime() : 0,
          b.resolvedAt ? new Date(b.resolvedAt).getTime() : 0,
          isAsc
        );

      default:
        return 0;
    }

  });
  this.updatePagedFaults();

}

compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean) {
  if (a === b) return 0;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  get totalPages(): number {
    return Math.max(Math.ceil(this.filteredFaults.length / this.pageSize), 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedFaults();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePagedFaults();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  private updatePagedFaults(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedFaults = this.filteredFaults.slice(startIndex, startIndex + this.pageSize);
  }

  
}
