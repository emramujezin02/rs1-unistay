import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminRoomCreateRequest } from '../../data/rooms.models';
import { RoomsFacade } from '../../data/rooms.facade';

@Component({
  selector: 'app-admin-room-form',
  standalone: false,
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(RoomsFacade);

  isEdit = false;
  roomId: number | null = null;

  readonly form = this.formBuilder.group({
    roomNumber: ['', [Validators.required, Validators.maxLength(50)]],
    hallId: [null as number | null, [Validators.required, Validators.min(1)]],
    maxOccupancy: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
    monthlyPrice: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.roomId = Number.isFinite(id) && id > 0 ? id : null;
    this.isEdit = this.roomId !== null;

    if (this.roomId) {
      this.facade.getById(this.roomId).subscribe(room => {
        this.form.patchValue({
          roomNumber: room.roomNumber,
          hallId: room.hallId ?? null,
          maxOccupancy: room.maxOccupancy,
          monthlyPrice: 0
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.toRequest();
    if (this.isEdit && this.roomId) {
      this.facade.updateRoom(this.roomId, request);
      return;
    }

    this.facade.createRoom(request);
  }

  cancel(): void {
    this.router.navigate(['/admin/rooms']);
  }

  private toRequest(): AdminRoomCreateRequest {
    const value = this.form.getRawValue();
    const roomNumber = value.roomNumber!.trim();
    return {
      roomNumber,
      floor: 0,
      maxOccupancy: value.maxOccupancy!,
      description: roomNumber,
      building: null,
      roomSide: null,
      hallId: value.hallId || null,
      nearExit: false,
      wheelchairAccessible: false,
      elevatorAccess: false,
      images: []
    };
  }
}
