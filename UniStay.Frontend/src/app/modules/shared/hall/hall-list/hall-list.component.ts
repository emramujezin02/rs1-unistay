import { Component, OnInit } from '@angular/core';
import { HallGetAllEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-all-endpoint.service'
import { HallDeleteEndpointService } from '../../../../endpoints/hall-endpoints/hall-delete-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HallUpdateEndpointService } from '../../../../endpoints/hall-endpoints/hall-update-endpoint.service';
import { ViewChild } from '@angular/core';
import { MatSort} from '@angular/material/sort';
import { trigger,transition,style,animate } from '@angular/animations';


@Component({
  selector: 'app-hall-list',
  templateUrl: './hall-list.component.html',
  styleUrls: ['./hall-list.component.scss'],
  standalone:false,
  animations: [ // NOVO
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

export class HallListComponent implements OnInit {
  halls: any[] = [];
  filteredHalls: any[] = [];
  pagedHalls: any[] = [];
  readonly pageSizeOptions = [5, 10, 20];
  currentPage = 1;
  pageSize = 10;

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
    name: '',
    capacity: '',
    availableFrom: '',
    availableTo: '',
    isAvailable: ''
  };

  loading = false;

  constructor(
    private hallGetAllService: HallGetAllEndpointService,
    private hallDeleteService: HallDeleteEndpointService,
    private hallUpdateService:HallUpdateEndpointService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('HallListComponent ngOnInit');
    this.loadHalls();
  }

sortData() {

  if (!this.sort || !this.sort.active || this.sort.direction === '') {
    return;
  }

  const isAsc = this.sort.direction === 'asc';

  this.filteredHalls = [...this.filteredHalls].sort((a, b) => {

    switch (this.sort!.active) {

      case 'name':
        return this.compare(
          a.name?.toLowerCase(),
          b.name?.toLowerCase(),
          isAsc
        );

      case 'capacity':
        return this.compare(
          a.capacity,
          b.capacity,
          isAsc
        );

      case 'availableFrom':
        return this.compare(
          new Date(a.availableFrom).getTime(),
          new Date(b.availableFrom).getTime(),
          isAsc
        );

      case 'availableTo':
        return this.compare(
          new Date(a.availableTo).getTime(),
          new Date(b.availableTo).getTime(),
          isAsc
        );

      case 'isAvailable':
        return this.compare(
          a.isAvailable,
          b.isAvailable,
          isAsc
        );

      default:
        return 0;
    }

  });
  this.updatePagedHalls();

}

compare(a: any, b: any, isAsc: boolean) {
  if (a === b) return 0;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  loadHalls(): void {
    this.loading = true;
    this.hallGetAllService.getAllHalls().subscribe({
      next: (res:any) => {
        this.halls = res;
        this.filteredHalls = [...res];
        this.currentPage = 1;
        this.updatePagedHalls();
        this.loading = false;
      },
      error: () => {
        alert('Error loading halls');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.filteredHalls = this.halls.filter((hall) => {
      const matchesName = hall.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesCapacity = !this.filters.capacity || hall.capacity >= +this.filters.capacity;
      const matchesAvailable = this.filters.isAvailable === '' || hall.isAvailable === (this.filters.isAvailable === 'true');
      const matchesDateFrom = !this.filters.availableFrom || new Date(hall.availableFrom) >= new Date(this.filters.availableFrom);
      const matchesDateTo = !this.filters.availableTo || new Date(hall.availableTo) <= new Date(this.filters.availableTo);

      return matchesName && matchesCapacity && matchesAvailable && matchesDateFrom && matchesDateTo;
    });
    this.sortData();
    this.updatePagedHalls();
  }

  clearFilters(): void {
    this.filters = { name: '', capacity: '', availableFrom: '', availableTo: '', isAvailable: '' };
    this.filteredHalls = [...this.halls];
    this.currentPage = 1;
    this.sortData();
    this.updatePagedHalls();
  }

  deleteHall(id: number): void {
    console.log("ID I am sending: ",id);
    if (confirm('Are you sure you want to delete this hall?')) {
      this.hallDeleteService.deleteHall(id).subscribe({
        next: () => {
          alert('Hall deleted');
          this.loadHalls();
        },
        error: (err) => {
          console.error("Backend error: ",err);
          alert('Error deleting');}
      });
    }
  }

  updateHall(id: number): void {
    this.router.navigate(['../hall-update', id], { relativeTo: this.route });
  }

  addHall(): void {
    this.router.navigate(['../hall-add'], { relativeTo: this.route });
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.filteredHalls.length / this.pageSize), 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedHalls();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePagedHalls();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  private updatePagedHalls(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedHalls = this.filteredHalls.slice(startIndex, startIndex + this.pageSize);
  }
}
