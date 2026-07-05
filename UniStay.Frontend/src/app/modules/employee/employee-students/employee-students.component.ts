import { Component, OnInit, ViewChild, effect, signal } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserGetAllEndpointService } from '../../../endpoints/user-endpoints/user-get-all-endpoint.service';
import { UserDto } from '../../../endpoints/user-endpoints/user.models';

@Component({
  selector: 'app-employee-students',
  templateUrl: './employee-students.component.html',
  styleUrls: ['./employee-students.component.scss'],
  standalone: false
})
export class EmployeeStudentsComponent implements OnInit {
  readonly students = signal<UserDto[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly displayedColumns = ['name', 'email', 'phone', 'status'];
  readonly dataSource = new MatTableDataSource<UserDto>();

  private search = '';
  private pageNumber = 1;
  private readonly pageSize = 15;
  private readonly studentRoleId = 2;

  constructor(private userGetAllService: UserGetAllEndpointService) {
    effect(() => {
      this.dataSource.data = this.students();
    });
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!sort) {
      return;
    }

    this.dataSource.sortingDataAccessor = (student: UserDto, property: string) => {
      switch (property) {
        case 'name':
          return this.fullName(student);
        case 'status':
          return student.isEnabled ? 'active' : 'disabled';
        default:
          return (student as any)[property] ?? '';
      }
    };
    this.dataSource.sort = sort;
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  onSearch(term: string): void {
    this.search = term;
    this.pageNumber = 1;
    this.loadStudents();
  }

  onPageChange(pageIndex: number): void {
    this.pageNumber = pageIndex + 1;
    this.loadStudents();
  }

  get currentPage(): number {
    return this.pageNumber - 1;
  }

  get ps(): number {
    return this.pageSize;
  }

  fullName(student: UserDto): string {
    const name = [student.firstName, student.lastName].filter(Boolean).join(' ').trim();
    return name || student.username || student.email;
  }

  initials(student: UserDto): string {
    const name = this.fullName(student);
    return name.charAt(0).toUpperCase();
  }

  roleLabel(student: UserDto): string {
    return (student as any).role || student.roleName || 'Student';
  }

  private loadStudents(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.userGetAllService.getAll({
      q: this.search,
      roleId: this.studentRoleId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: result => {
        const items = result.items ?? [];
        this.students.set(items);
        this.totalCount.set(result.totalItems ?? result.totalCount ?? items.length);
        this.loading.set(false);
      },
      error: () => {
        this.students.set([]);
        this.totalCount.set(0);
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }
}
