import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HallReservation } from '../../data/hall-reservations.models';
import { HallReservationsFacade } from '../../data/hall-reservations.facade';

@Component({
  selector: 'app-hall-reservation-list',
  standalone: false,
  templateUrl: './hall-reservation-list.component.html',
  styleUrl: './hall-reservation-list.component.scss'
})
export class HallReservationListComponent implements OnInit {
  readonly displayedColumns = ['hall', 'student', 'dates', 'status', 'created', 'actions'];
  readonly dataSource = new MatTableDataSource<HallReservation>();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sortingDataAccessor = (item: HallReservation, property: string) => {
        switch (property) {
          case 'hall':
            return item.hallName;
          case 'student':
            return item.studentEmail || item.studentUsername;
          case 'dates':
            return new Date(item.fromDate).getTime();
          case 'created':
            return new Date(item.createdAt).getTime();
          default:
            return (item as any)[property] ?? '';
        }
      };
      this.dataSource.sort = sort;
    }
  }

  constructor(public facade: HallReservationsFacade) {
    effect(() => {
      this.dataSource.data = this.facade.reservations();
    });
  }

  ngOnInit(): void {
    this.facade.load();
  }

  approve(reservation: HallReservation): void {
    this.facade.approve(reservation.id);
  }

  reject(reservation: HallReservation): void {
    this.facade.reject(reservation.id);
  }

  statusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Rejected':
        return 'warn';
      case 'Pending':
        return 'accent';
      default:
        return '';
    }
  }

  isPending(reservation: HallReservation): boolean {
    return reservation.status === 'Pending';
  }
}
