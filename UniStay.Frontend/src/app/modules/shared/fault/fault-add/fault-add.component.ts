import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaultGetByIdEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-by-id-endpoint.service';
import { FaultUpdateEndpointService } from '../../../../endpoints/fault-endpoints/fault-update-endpoint.service';
import { FaultCreateEndpointService, FaultCreateRequest } from '../../../../endpoints/fault-endpoints/fault-create-endpoint.service';
import { FaultGetAllEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-all-endpoint.service';
import { RoomGetAllEndpointService } from '../../../../endpoints/fault-endpoints/room-get-all-endpoint.service';
import { RoomViewModel } from '../../../../endpoints/room-endpoints/room.models';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-fault-add',
  templateUrl: './fault-add.component.html',
    styleUrls: ['./fault-add.component.scss'],
  standalone:false,
    animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),

    trigger('fieldAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ])
    ])
  ]
})
export class FaultAddComponent implements OnInit, OnDestroy {
  private readonly draftStorageKey = 'unistay_fault_add_draft';
  form!: FormGroup;
  roomControl = new FormControl<RoomViewModel | string>('');
  faultId!: number | null;
  isAddMode = false;
  loading = false;
  rooms: RoomViewModel[] = [];
  filteredRooms: RoomViewModel[] = [];
  isSaving=false;
  private draftSavedTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private faultGetByIdService: FaultGetByIdEndpointService,
    private faultUpdateService: FaultUpdateEndpointService,
    private faultCreateService: FaultCreateEndpointService,
    private faultGetAllService:FaultGetAllEndpointService,
    private roomGetAllService:RoomGetAllEndpointService,
    private route: ActivatedRoute,
    private router: Router,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title:['',[Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description:['', Validators.maxLength(2000)],
      reportedBy:[''],
      roomID:['',[Validators.required, Validators.min(1)]]
    });

    this.faultId = Number(this.route.snapshot.paramMap.get('id'));
    this.isAddMode = !!this.faultId;

    const userId=Number(localStorage.getItem("id"));
    this.form.patchValue({reportedBy:userId}, { emitEvent: false });

    if (!this.isAddMode) {
      this.restoreFaultDraft();
    }

    this.form.valueChanges
      .pipe(
        debounceTime(1500),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.saveFaultDraft());

    this.roomGetAllService.getAllRooms().subscribe({
      next:(data)=>{
        this.rooms=data;
        this.filteredRooms = this.filterRooms(this.getRoomSearchText(this.roomControl.value));
        this.setRoomInputFromSelectedId();
      }
    });


    if (this.isAddMode) {
      this.loadFault();
    }

      this.roomControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(value => {
        const searchValue = this.getRoomSearchText(value);
        this.filteredRooms = this.filterRooms(searchValue);

        const selectedRoomId = this.form.get('roomID')?.value;
        const selectedRoom = this.rooms.find(room => room.roomID === selectedRoomId);

        if (!selectedRoom || this.displayRoom(selectedRoom) !== searchValue) {
          this.form.get('roomID')?.setValue(null);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.draftSavedTimer) {
      clearTimeout(this.draftSavedTimer);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  displayRoom(room: RoomViewModel | null): string {
    if (!room) {
      return '';
    }

    return room.building ? `${room.roomNumber} (${room.building})` : room.roomNumber;
  }

  displayRoomValue = (value: RoomViewModel | string | null): string => {
    return this.getRoomSearchText(value);
  };

  onRoomSelected(room: RoomViewModel): void {
    this.roomControl.setValue(this.displayRoom(room), { emitEvent: false });
    this.form.get('roomID')?.setValue(room.roomID);
    this.filteredRooms = this.filterRooms(this.displayRoom(room));
  }

  onRoomBlur(): void {
    this.form.get('roomID')?.markAsTouched();
  }

  loadFault(): void {
    this.loading = true;
    this.faultGetByIdService.getFaultById(this.faultId!).subscribe({
      next: (fault) => {
        this.form.patchValue(fault);
        this.setRoomInputFromSelectedId();

        if(fault.resolvedAt!=null){
  this.form.patchValue({isResolved:true});
}

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error loading fault');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }



const payload: FaultCreateRequest = {
  title: this.form.value.title,
  description: this.form.value.description,
  reportedBy: this.form.value.reportedBy,
  roomID:this.form.value.roomID
  
};

    this.loading = true;

    if (this.isAddMode) {
      this.faultUpdateService.updateFault(this.faultId!, payload).subscribe({
        next: () => {
          alert('Fault successfully updated!');
          this.router.navigate(['../fault-list'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error(err);
          alert('Error updating fault');
          this.loading = false;
        }
      });
    } else {
      this.faultCreateService.createFault(payload).subscribe({
        next: () => {
          this.clearFaultDraft();
          alert('Fault successfully added!');
          this.router.navigate(['../fault-list'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error(err);
          alert('Error adding fault');
          this.loading = false;
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['../fault-list'], { relativeTo: this.route });
  }

  private saveFaultDraft(): void {
    if (this.isAddMode) {
      return;
    }

    try {
      localStorage.setItem(this.draftStorageKey, JSON.stringify(this.getFaultDraftValue()));
      this.showDraftSavedIndicator();
    } catch (error) {
      console.error('Error saving fault draft', error);
      this.isSaving = false;
    }
  }

  private restoreFaultDraft(): void {
    const rawDraft = localStorage.getItem(this.draftStorageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft);

      if (!draft || typeof draft !== 'object') {
        return;
      }

      this.form.patchValue({
        title: typeof draft.title === 'string' ? draft.title : '',
        description: typeof draft.description === 'string' ? draft.description : '',
        roomID: typeof draft.roomID === 'number' ? draft.roomID : null
      }, { emitEvent: false });

      this.setRoomInputFromSelectedId();
    } catch (error) {
      console.error('Error restoring fault draft', error);
      localStorage.removeItem(this.draftStorageKey);
    }
  }

  private clearFaultDraft(): void {
    localStorage.removeItem(this.draftStorageKey);
  }

  private getFaultDraftValue(): Partial<FaultCreateRequest> {
    return {
      title: this.form.value.title,
      description: this.form.value.description,
      roomID: this.form.value.roomID
    };
  }

  private showDraftSavedIndicator(): void {
    this.isSaving = true;

    if (this.draftSavedTimer) {
      clearTimeout(this.draftSavedTimer);
    }

    this.draftSavedTimer = setTimeout(() => {
      this.isSaving = false;
      this.draftSavedTimer = null;
    }, 2000);
  }
  
  private filterRooms(value: string): RoomViewModel[] {
    const searchValue = value.toLowerCase().trim();

    if (!searchValue) {
      return this.rooms;
    }

    return this.rooms.filter(room =>
      this.displayRoom(room).toLowerCase().includes(searchValue)
    );
  }

  private getRoomSearchText(value: RoomViewModel | string | null): string {
    if (!value) {
      return '';
    }

    return typeof value === 'string' ? value : this.displayRoom(value);
  }

  private setRoomInputFromSelectedId(): void {
    const selectedRoomId = this.form?.get('roomID')?.value;
    const selectedRoom = this.rooms.find(room => room.roomID === selectedRoomId);

    if (selectedRoom) {
      this.roomControl.setValue(this.displayRoom(selectedRoom), { emitEvent: false });
    }
  }
}
