import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaultGetByIdEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-by-id-endpoint.service';
import { FaultUpdateEndpointService } from '../../../../endpoints/fault-endpoints/fault-update-endpoint.service';
import { FaultCreateEndpointService, FaultCreateRequest } from '../../../../endpoints/fault-endpoints/fault-create-endpoint.service';
import { FaultGetAllEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-all-endpoint.service';
import { RoomGetAllEndpointService } from '../../../../endpoints/fault-endpoints/room-get-all-endpoint.service';
import { AutocompleteEndpointService } from '../../../../endpoints/autocomplete/autocomplete-endpoint.service';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-fault-add',
  templateUrl: './fault-add.component.html',
    styleUrls: ['./fault-add.component.scss'],
  standalone:false,
    animations: [
    // FORM ANIMACIJA
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),

    // INPUT ANIMACIJA
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
export class FaultAddComponent {
  form!: FormGroup;
  faultId!: number | null;
  isAddMode = false;
  loading = false;
  rooms:any[]=[];
  nameSuggestions:string[]=[];
  isSaving=false;

  constructor(
    private fb: FormBuilder,
    private faultGetByIdService: FaultGetByIdEndpointService,
    private faultUpdateService: FaultUpdateEndpointService,
    private faultCreateService: FaultCreateEndpointService,
    private faultGetAllService:FaultGetAllEndpointService,
    private roomGetAllService:RoomGetAllEndpointService,
    private route: ActivatedRoute,
    private autocompleteService:AutocompleteEndpointService,
    private router: Router,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title:['',Validators.required],
      description:['',Validators.required],
      reportedBy:[''],
      roomID:['',Validators.required]
    });

    this.form.valueChanges
.pipe(
  debounceTime(1500)
)
.subscribe(value => {

  if (this.form.invalid) return;

  const payload = {
    title: value.title,
    description: value.description,
    reportedBy: value.reportedBy,
    roomID: value.roomID
  };

  if (this.faultId) {

    this.faultUpdateService.updateFault(this.faultId, payload)
      .subscribe();

  } else {

    this.faultCreateService.createFault(payload)
      .subscribe((res:any) => {

        if(res?.faultID){
          this.faultId = res.faultID;
          this.isAddMode = true;
        }

      });

  }

});

    this.faultId = Number(this.route.snapshot.paramMap.get('id'));
    this.isAddMode = !!this.faultId;

    const userId=Number(localStorage.getItem("id"));
    this.form.patchValue({reportedBy:userId});

    this.roomGetAllService.getAllRooms().subscribe({
      next:(data)=>this.rooms=data
    });

    this.form.patchValue({reportedBy:userId});

    if (this.isAddMode) {
      this.loadFault();
    }

      this.form.get('title')?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          if (!value || value.length < 1) {
            return of([]);
          }
    
          
           return this.autocompleteService.getSuggestions('faults',value);
       
        })
      ).subscribe(results => {
        this.nameSuggestions = results;
      });
  }

    onNameSelected(value: string) {
  this.form.get('title')?.setValue(value);
}

  loadFault(): void {
    this.loading = true;
    this.faultGetByIdService.getFaultById(this.faultId!).subscribe({
      next: (fault) => {
        this.form.patchValue(fault);

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
}
