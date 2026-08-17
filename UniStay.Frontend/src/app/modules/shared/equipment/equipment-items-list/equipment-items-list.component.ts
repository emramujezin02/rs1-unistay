import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EquipmentItemsGetAllService } from '../../../../endpoints/equipment-endpoints/equipment-items-gel-all-endpoint.service';
import { EquipmentItemsUpdateService } from '../../../../endpoints/equipment-endpoints/equipment-items-update-endpoint.service';
import { EquipmentGetOneService } from '../../../../endpoints/equipment-endpoints/equipment-items-get-one-endpoint.service';
import { ViewChild } from '@angular/core';
import { MatSort} from '@angular/material/sort'
import { trigger,transition,style,animate } from '@angular/animations';

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
  items: any[] = [];
  filteredItems: any[] = [];
  pagedItems: any[] = [];
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
    private getone:EquipmentGetOneService

  ) {}

  ngOnInit(): void {
    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadItems();

    this.getone.getOne(this.equipmentId).subscribe(eq => {
      this.equipmentName = eq.name;
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
        alert("Error loading equipment items");
      }
    });
  }

  toggleAvailability(item: any) {
    const newStatus = !item.isAvailable;

    this.update.updateAvailability(item.recordID, newStatus).subscribe({
      next: () => this.loadItems(),
      error: () => alert("Error updating availability")
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
modalData: any = {
  itemId: 0,
  assignedAt: '',
  returnedAt: '',
  location: ''
};

openAssignModal(item: any) {
  this.modalData = {
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
  const payload = {
    equipmentRecordID: this.modalData.recordID,
    assignedAt: this.modalData.assignedAt ? new Date(this.modalData.assignedAt).toISOString() : null,
    returnedAt: this.modalData.returnedAt ? new Date(this.modalData.returnedAt).toISOString() : null,
    location: this.modalData.location,
  };

  console.log("ASSIGN PAYLOAD:", payload);

  this.update.assignItem(payload).subscribe({
    next: () => {
      this.closeModal();
      this.loadItems();
    },
    error: (err) => {
      console.error('Assign error', err);
      alert('Error assigning item');
    }
  });
}

releaseItem(item: any) {
  if (!confirm("Are you sure you want to release this item?")) return;

  this.update.releaseItem(item.recordID).subscribe({
    next: () => this.loadItems(),
    error: () => alert("Error releasing item")
  });
}

delete(id:number) {
  if (!confirm("Delete?")) return;

  this.update.deleteRecord(id).subscribe({
    next: () => this.loadItems(),
    error: () => alert("Error deleting item")
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



compare(a: any, b: any, isAsc: boolean) {
  if (a === b) return 0;
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
