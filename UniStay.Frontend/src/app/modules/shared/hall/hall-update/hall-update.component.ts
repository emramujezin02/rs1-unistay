import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HallGetByIdEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-by-id-endpoint.service';
import { HallUpdateEndpointService } from '../../../../endpoints/hall-endpoints/hall-update-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-hall-update',
  templateUrl: './hall-update.component.html',
  styleUrls: ['./hall-update.component.scss'],
  standalone: false,
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
export class HallUpdateComponent implements OnInit {

  hall: any = {};
  form!: FormGroup;
  loading = true;
  submitted = false;
  readonly minCapacity = 1;
  readonly maxCapacity = 1000;
  readonly nameMaxLength = 100;
  readonly descriptionMaxLength = 1000;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private hallGetByIdService: HallGetByIdEndpointService,
    private hallUpdateService: HallUpdateEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
      capacity: ['', [Validators.required, Validators.min(this.minCapacity), Validators.max(this.maxCapacity)]],
      description: ['', [Validators.maxLength(this.descriptionMaxLength)]],
      availableFrom: ['', Validators.required],
      availableTo: ['', Validators.required],
      isAvailable: [true]
    }, { validators: this.availableDateRangeValidator });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.hallGetByIdService.getHallById(id).subscribe({
      next: (data) => {
         console.log('API RESPONSE hall:', data);
        this.hall = data;
     this.hall.availableFrom = this.hall.availableFrom ? this.hall.availableFrom.split('T')[0] : null;
    this.hall.availableTo   = this.hall.availableTo   ? this.hall.availableTo.split('T')[0]   : null;


        this.form.patchValue({
          name: this.hall.name,
          capacity: this.hall.capacity,
          description: this.hall.description,
          availableFrom: this.hall.availableFrom,
          availableTo: this.hall.availableTo,
          isAvailable: this.hall.isAvailable
        });

        this.loading = false;
      },
      error: () => {
        alert('Error loading hall');
        this.router.navigate(['../../hall-list'], { relativeTo: this.route });
      }
    });
  }

  saveHall() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.hall = {
      ...this.hall,
      name: this.form.value.name,
      capacity: this.form.value.capacity,
      description: this.form.value.description,
      availableFrom: this.form.value.availableFrom,
      availableTo: this.form.value.availableTo,
      isAvailable: this.form.value.isAvailable
    };

    this.hallUpdateService.updateHall(this.hall.hallID, this.hall).subscribe({
      next: () => {
        alert('Successfully updated');
        this.router.navigate(['../../hall-list'], { relativeTo: this.route });
      },
      error: () => alert('Error saving')
    });
  }

  private availableDateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const availableFrom = control.get('availableFrom')?.value;
    const availableTo = control.get('availableTo')?.value;

    if (!availableFrom || !availableTo) {
      return null;
    }

    const fromDate = new Date(availableFrom);
    const toDate = new Date(availableTo);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return null;
    }

    return toDate > fromDate ? null : { invalidDateRange: true };
  }

  isDateRangeInvalid(): boolean {
    return this.form?.hasError('invalidDateRange') ?? false;
  }

  back() {
    this.router.navigate(['../../hall-list'], { relativeTo: this.route });
  }
}
