import { Component, OnInit } from '@angular/core';
import { EquipmentGetAllEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-get-all-endpoint.service';
import { EquipmentDeleteEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-delete-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentUpdateComponent } from '../equipment-update/equipment-update.component';
import { ViewChild } from '@angular/core';
import { MatSort} from '@angular/material/sort'
import { trigger,transition,style,animate } from '@angular/animations';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
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
export class EquipmentListComponent implements OnInit {
  equipments: any[] = [];
  filteredEquipment: any[] = [];
  pagedEquipment: any[] = [];
  equipmentTypes: string[] = [];
  readonly pageSizeOptions = [5, 10, 20];
  currentPage = 1;
  pageSize = 10;
  filters: {
    name: string;
    type: string;
    minQty: number | null;
    maxQty: number | null;
    availableOnly: boolean;
  } = {
    name: '',
    type: '',
    minQty: null,
    maxQty: null,
    availableOnly: false
  };
  filterError = '';
  loading = false;
  displayedColumns: string[] = [
  'name',
  'equipmentType',
  'description',
  'quantity',
  'availableQuantity',
  'rentalPrice',
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
    private equipmentGetAllservice: EquipmentGetAllEndpointService,
    private equipmentDeleteService: EquipmentDeleteEndpointService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.loadEquipment();
  }


  loadEquipment(filters?: any): void {
    this.loading = true;
    this.equipmentGetAllservice.getAllEquipments(filters).subscribe({
      next:(res:any)=>{
        this.equipments=res;
        this.filteredEquipment=[...res];
        if (!filters) {
          this.updateEquipmentTypes(res);
        }
        this.currentPage = 1;
        this.updatePagedEquipment();
        this.loading=false;
      },
      error:()=>{
        alert('Error loading equipments');
        this.loading=false;
      }
    });
  }

 applyFilters() {
  if (this.hasNegativeQuantityFilter()) {
    this.filterError = 'Quantity filters must be 0 or greater.';
    return;
  }

  if (this.isQuantityRangeInvalid()) {
    this.filterError = 'Min quantity must be less than or equal to max quantity.';
    return;
  }

  this.filterError = '';
  this.currentPage = 1;
  this.loadEquipment(this.buildFilterParams());
}

  clearFilters():void{ 
    this.filters = {
      name: '',
      type: '',
      minQty: null,
      maxQty: null,
      availableOnly: false
    };
    this.filterError = '';
    this.filteredEquipment=[...this.equipments];
    this.currentPage = 1;
    this.loadEquipment();
  }

  deleteEquipment(id:number):void{
if (confirm('Are you sure yout wand to delete this equipment?')) {
      this.equipmentDeleteService.deleteEquipment(id).subscribe({
        next: () => {
          alert('Equipment deleted');
          this.loadEquipment();
        },
        error: (err) => {
          console.error("Backend error: ",err);
          alert('Error deleting');}
      });
    }}

  updateEquipment(id:number):void{ 
    this.router.navigate(['../equipment-update', id], { relativeTo: this.route });
  }

  addEquipment(): void {
    this.router.navigate(['../equipment-add'], { relativeTo: this.route });
  }

     openItems(id:number){
    this.router.navigate(['../equipment-items-list', id], { relativeTo: this.route });
  }

  sortData() {

  if (!this.sort || !this.sort.active || this.sort.direction === '') {
    return;
  }

  const isAsc = this.sort.direction === 'asc';

  this.filteredEquipment = [...this.filteredEquipment].sort((a, b) => {

    switch (this.sort.active) {

      case 'name':
        return this.compare(
          a.name?.toLowerCase(),
          b.name?.toLowerCase(),
          isAsc
        );

      case 'equipmentType':
        return this.compare(
          a.equipmentType?.toLowerCase(),
          b.equipmentType?.toLowerCase(),
          isAsc
        );

      case 'quantity':
        return this.compare(
          a.quantity,
          b.quantity,
          isAsc
        );

      case 'availableQuantity':
        return this.compare(
          a.availableQuantity,
          b.availableQuantity,
          isAsc
        );

      case 'rentalPrice':
        return this.compare(
          a.rentalPrice,
          b.rentalPrice,
          isAsc
        );

      default:
        return 0;
    }

  });
  this.updatePagedEquipment();

}


  compare(a: any, b: any, isAsc: boolean) {
  if (a === b) return 0;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  get totalPages(): number {
    return Math.max(Math.ceil(this.filteredEquipment.length / this.pageSize), 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagedEquipment();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePagedEquipment();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  private updatePagedEquipment(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedEquipment = this.filteredEquipment.slice(startIndex, startIndex + this.pageSize);
  }

  private buildFilterParams(): any {
    const minQty = this.toNullableNumber(this.filters.minQty);
    const maxQty = this.toNullableNumber(this.filters.maxQty);

    return {
      name: this.filters.name?.trim(),
      type: this.filters.type?.trim(),
      minQty,
      maxQty,
      availableOnly: this.filters.availableOnly
    };
  }

  private isQuantityRangeInvalid(): boolean {
    const minQty = this.toNullableNumber(this.filters.minQty);
    const maxQty = this.toNullableNumber(this.filters.maxQty);

    return minQty != null &&
      maxQty != null &&
      minQty > maxQty;
  }

  private hasNegativeQuantityFilter(): boolean {
    const minQty = this.toNullableNumber(this.filters.minQty);
    const maxQty = this.toNullableNumber(this.filters.maxQty);

    return (minQty != null && minQty < 0) ||
      (maxQty != null && maxQty < 0);
  }

  private toNullableNumber(value: number | string | null): number | null {
    if (value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
  }

  private updateEquipmentTypes(equipment: any[]): void {
    this.equipmentTypes = Array.from(
      new Set(
        equipment
          .map(item => item.equipmentType as string | null | undefined)
          .filter((type): type is string => !!type)
      )
    ).sort((a, b) => a.localeCompare(b));
  }
}
