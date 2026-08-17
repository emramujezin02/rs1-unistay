import { Component, effect, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AdminUser } from '../../data/users.models';
import { UsersFacade } from '../../data/users.facade';

@Component({
  selector: 'app-admin-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
  readonly displayedColumns = ['username', 'email', 'firstName', 'lastName', 'role', 'actions'];
  readonly dataSource = new MatTableDataSource<AdminUser>();
  readonly searchCtrl = new FormControl('');
  private readonly destroy$ = new Subject<void>();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    public facade: UsersFacade,
    private translate: TranslateService
  ) {
    effect(() => {
      this.dataSource.data = this.facade.users();
    });
  }

  ngOnInit(): void {
    this.facade.loadUsers();

    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.facade.applyFilters({ search: value ?? '' });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteUser(user: AdminUser): void {
    const id = user.id ?? user.userID;
    const message = this.translate.instant('ADMIN.USERS.DELETE_CONFIRM', { username: user.username });
    if (window.confirm(message)) {
      this.facade.deleteUser(id);
    }
  }

  statusColor(user: AdminUser): string {
    return user.isEnabled ? 'primary' : 'warn';
  }
}
