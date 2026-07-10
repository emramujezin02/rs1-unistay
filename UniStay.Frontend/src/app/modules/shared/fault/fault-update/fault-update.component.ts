import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaultGetByIdEndpointService } from '../../../../endpoints/fault-endpoints/fault-get-by-id-endpoint.service';
import { FaultUpdateEndpointService } from '../../../../endpoints/fault-endpoints/fault-update-endpoint.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FaultCreateEndpointService } from '../../../../endpoints/fault-endpoints/fault-create-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-fault-update',
  templateUrl: './fault-update.component.html',
  styleUrls: ['./fault-update.component.scss'],
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
export class FaultUpdateComponent implements OnInit {

  form!: FormGroup;
  id: number | null = null;
  isEdit = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private faultGetByIdService: FaultGetByIdEndpointService,
    private faultUpdateService: FaultUpdateEndpointService,
    private faultCreateService: FaultCreateEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [''],
      status: ['Unresolved', Validators.required],
      resolvedAt: ['']
    });

    this.form.get('status')?.valueChanges.subscribe(value => {
      const resolvedAt = this.form.get('resolvedAt');

      if (value === 'Resolved') {
        resolvedAt?.setValidators([Validators.required]);
        resolvedAt?.enable();
      } else {
        resolvedAt?.clearValidators();
        resolvedAt?.setValue('');
        resolvedAt?.disable();
      }

      resolvedAt?.updateValueAndValidity();
    });

    this.form.get('status')?.updateValueAndValidity();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;

      this.faultGetByIdService.getFaultById(this.id).subscribe({
        next: (data) => {

          this.form.patchValue({
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: data.isResolved ? 'Resolved' : 'Unresolved',
            resolvedAt: data.resolvedAt
              ? data.resolvedAt.split('T')[0]
              : ''
          });

          this.loading = false;
        },
        error: () => {
          alert('Error loading fault');
          this.loading = false;
        }
      });
    }
  }

  saveFault() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const isResolved = formValue.status === 'Resolved';
    const payload = {
      ...formValue,
      status: isResolved ? 'Resolved' : 'Open',
      isResolved,
      resolvedAt: isResolved ? formValue.resolvedAt : null
    };

    if (this.isEdit && this.id) {

      this.faultUpdateService.updateFault(this.id, payload).subscribe({
        next: () => {
          alert('Updated successfully');
          this.router.navigate(['/fault-list'], { relativeTo: this.route });
        },
        error: () => alert('Save error')
      });

    } else {

      this.faultCreateService.createFault(payload).subscribe({
        next: () => {
          alert('Fault added');
          this.router.navigate(['/fault-list'], { relativeTo: this.route });
        },
        error: () => alert('Create error')
      });
    }
  }

  back() {
    this.router.navigate(['../../fault-list'], { relativeTo: this.route });
  }
}
