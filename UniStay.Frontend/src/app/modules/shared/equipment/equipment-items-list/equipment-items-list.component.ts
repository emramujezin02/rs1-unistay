import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EquipmentItemRecord, EquipmentItemsGetAllService } from '../../../../endpoints/equipment-endpoints/equipment-items-gel-all-endpoint.service';
import { EquipmentItemAssignPayload, EquipmentItemsUpdateService } from '../../../../endpoints/equipment-endpoints/equipment-items-update-endpoint.service';
import { EquipmentGetOneService } from '../../../../endpoints/equipment-endpoints/equipment-items-get-one-endpoint.service';
import { ViewChild } from '@angular/core';
import { MatSort} from '@angular/material/sort'
import { trigger,transition,style,animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

interface EquipmentItemAssignModalData {
  itemId: number;
  recordID: number;
  assignedAt: string;
  returnedAt: string;
  location: string;
}

@Component({
  selector: 'app-equipment-items-list',
  templateUrl: './equipment-items-list.component.html',
  styleUrls: ['./equipment-items-list.component.scss'],
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
export class EquipmentItemsListComponent implements OnInit {

  equipmentId!: number;
  items: EquipmentItemRecord[] = [];
  filteredItems: EquipmentItemRecord[] = [];
  pagedItems: EquipmentItemRecord[] = [];
  readonly pageSizeOptions = [5, 10, 20];
  currentPage = 1;
  pageSize = 10;
  loading = false;
  equipmentName:string='';
  filters = {
    search: '',
    status: '',
    location: '',
    assignedDate: '',
    returnedDate: ''
  };
  displayedColumns: string[] = [
  'serial',
  'assigned',
  'returned',
  'location',
  'status',
  'actions'
];
  @ViewChild(MatSort) set matSort(sort:MatSort){
    if(sort){
      this.sort=sort;
      this.sort.sortChange.subscribe(()=>{
        this.sortData();
      })
    }
  }
  sort!:MatSort;
  

  constructor(
    private route: ActivatedRoute,
    private get: EquipmentItemsGetAllService,
    private update: EquipmentItemsUpdateService,
    private router:Router,
    private getone:EquipmentGetOneService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadItems();

    this.getone.getOne(this.equipmentId).subscribe(eq => {
      this.equipmentName = eq.name ?? '';
    });
  }

  loadItems() {
    this.loading = true;
    this.get.getItemsByEquipment(this.equipmentId).subscribe({
      next: get => {
        this.items = get;
        this.filteredItems = [...get];
        this.currentPage = 1;
        this.updatePagedItems();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading equipment items', 'OK', { duration: 3000 });
      }
    });
  }

  toggleAvailability(item: EquipmentItemRecord) {
    const newStatus = !item.isAvailable;

    this.update.updateAvailability(item.recordID, newStatus).subscribe({
      next: () => this.loadItems(),
      error: () => this.snackBar.open('Error updating availability', 'OK', { duration: 3000 })
    });
  }

  addNewItem(){
    const createRoute = this.router.url.startsWith('/admin')
      ? '/admin/equipment-items-create'
      : '/employee/equipment/equipment-items-create';

    this.router.navigate([createRoute, this.equipmentId]);
  }

  backToEquipment(): void {
    this.router.navigate(['../../equipment-list'], { relativeTo: this.route });
  }

  applyFilters(): void {
    this.currentPage = 1;
    const search = (this.filters.search || '').toLowerCase().trim();
    const location = (this.filters.location || '').toLowerCase().trim();

    this.filteredItems = this.items.filter(item => {
      const searchableName = (item.name || item.serialNumber || '').toLowerCase();
      const matchesSearch = !search || searchableName.includes(search);
      const matchesStatus =
        this.filters.status === '' ||
        (this.filters.status === 'available' && item.isAvailable) ||
        (this.filters.status === 'taken' && !item.isAvailable);
      const matchesLocation =
        !location ||
        (item.location || '').toLowerCase().includes(location);
      const hasAssignedDate = !!(item.assignedAt || item.assignedAtUtc);
      const hasReturnedDate = !!(item.returnedAt || item.returnedAtUtc);
      const matchesAssignedDate =
        this.filters.assignedDate === '' ||
        (this.filters.assignedDate === 'set' && hasAssignedDate) ||
        (this.filters.assignedDate === 'empty' && !hasAssignedDate);
      const matchesReturnedDate =
        this.filters.returnedDate === '' ||
        (this.filters.returnedDate === 'set' && hasReturnedDate) ||
        (this.filters.returnedDate === 'empty' && !hasReturnedDate);

      return matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesAssignedDate &&
        matchesReturnedDate;
    });

    this.sortData();
    this.updatePagedItems();
  }

  showModal = false;
modalData: EquipmentItemAssignModalData = {
  itemId: 0,
  recordID: 0,
  assignedAt: '',
  returnedAt: '',
  location: ''
};

openAssignModal(item: EquipmentItemRecord) {
  this.modalData = {
    itemId: item.recordID,
    recordID: item.recordID,
    assignedAt: '',
    returnedAt: '',
    location: ''
  };
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
}

confirmAssign() {
  const payload: EquipmentItemAssignPayload = {
    equipmentRecordID: this.modalData.recordID,
    assignedAt: this.modalData.assignedAt ? new Date(this.modalData.assignedAt).toISOString() : null,
    returnedAt: this.modalData.returnedAt ? new Date(this.modalData.returnedAt).toISOString() : null,
    location: this.modalData.location,
  };

  this.update.assignItem(payload).subscribe({
    next: () => {
      this.closeModal();
      this.loadItems();
    },
    error: (err) => {
      console.error('Assign error', err);
      this.snackBar.open('Error assigning item', 'OK', { duration: 3000 });
    }
  });
}

releaseItem(item: EquipmentItemRecord) {
  this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Are you sure you want to release this item?' }
  }).afterClosed().subscribe(confirmed => {
    if (!confirmed) {
      return;
    }

    this.update.releaseItem(item.recordID).subscribe({
      next: () => this.loadItems(),
      error: () => this.snackBar.open('Error releasing item', 'OK', { duration: 3000 })
    });
  });
}

delete(id:number) {
  this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Delete this equipment item?' }
  }).afterClosed().subscribe(confirmed => {
    if (!confirmed) {
      return;
    }

    this.update.deleteRecord(id).subscribe({
      next: () => this.loadItems(),
      error: () => this.snackBar.open('Error deleting item', 'OK', { duration: 3000 })
    });
  });
}


sortData() {
  if (!this.sort || !this.sort.active || this.sort.direction === '') {
    return;
  }

  const isAsc = this.sort.direction === 'asc';

  this.filteredItems = [...this.filteredItems].sort((a, b) => {
    
    switch (this.sort!.active) {
      
      case 'serial':
        return this.compare(
          a.serialNumber?.toLowerCase(), 
          b.serialNumber?.toLowerCase(), 
          isAsc
        );

      case 'assigned':
        return this.compare(
          a.assignedAt ? new Date(a.assignedAt).getTime() : 0,
          b.assignedAt ? new Date(b.assignedAt).getTime() : 0,
          isAsc
        );

      case 'returned':
        return this.compare(
          a.returnedAt ? new Date(a.returnedAt).getTime() : 0,
          b.returnedAt ? new Date(b.returnedAt).getTime() : 0,
          isAsc
        );

      case 'location':
        return this.compare(
          (a.location || '').toLowerCase(),
          (b.location || '').toLowerCase(),
          isAsc
        );

      case 'status':
        return this.compare(
          a.isAvailable,
          b.isAvailable,
          isAsc
        );

      default:
        return 0;
    }
  });
  this.updatePagedItems();
}

editItem(id: number) {
  const updateRoute = this.router.url.startsWith('/admin')
    ? '/admin/equipment-items-update'
    : '/employee/equipment/equipment-items-update';

  this.router.navigate([updateRoute, id]);
}



compare(a: string | number | boolean | undefined, b: string | number | boolean | undefined, isAsc: boolean) {
  if (a === b) return 0;
  if (a === undefined) return isAsc ? -1 : 1;
  if (b === undefined) return isAsc ? 1 : -1;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

get totalPages(): number {
  return Math.max(Math.ceil(this.filteredItems.length / this.pageSize), 1);
}

get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, index) => index + 1);
}

changePageSize(size: number): void {
  this.pageSize = size;
  this.currentPage = 1;
  this.updatePagedItems();
}

goToPage(page: number): void {
  if (page < 1 || page > this.totalPages || page === this.currentPage) {
    return;
  }

  this.currentPage = page;
  this.updatePagedItems();
}

previousPage(): void {
  this.goToPage(this.currentPage - 1);
}

nextPage(): void {
  this.goToPage(this.currentPage + 1);
}

private updatePagedItems(): void {
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  const startIndex = (this.currentPage - 1) * this.pageSize;
  this.pagedItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
}
}
