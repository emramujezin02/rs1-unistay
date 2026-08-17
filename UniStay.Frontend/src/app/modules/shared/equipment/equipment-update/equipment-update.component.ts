import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EquipmentGetByIdEndpointService } from '../../../../endpoints/equipment-endpoints/equpiment-get-by-id-endpoint.service';
import { EquipmentUpdateEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-update-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-equipment-update',
  templateUrl: './equipment-update.component.html',
  styleUrls: ['./equipment-update.component.scss'],
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
export class EquipmentUpdateComponent implements OnInit {

  equipment: any = {};
  form!: FormGroup;
  loading = true;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private getByIdService: EquipmentGetByIdEndpointService,
    private updateService: EquipmentUpdateEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.minLength(2), Validators.maxLength(150)]],
      description: ['', Validators.maxLength(1000)],
      rentalPrice: ['', Validators.maxLength(100)],
      equipmentType: ['', Validators.maxLength(100)],
      quantity: ['', [Validators.required, Validators.min(0)]],
      availableQuantity: ['', [Validators.required, Validators.min(0)]]
    }, { validators: this.availableQuantityWithinQuantity });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.getByIdService.getEquipmentById(id).subscribe({
      next: (data) => {
        console.log('Equipment API response:', data);

        this.equipment = data;

        this.form.patchValue({
          name: this.equipment.name,
          description: this.equipment.description,
          rentalPrice: this.equipment.rentalPrice,
          equipmentType: this.equipment.equipmentType,
          quantity: this.equipment.quantity,
          availableQuantity: this.equipment.availableQuantity
        });

        this.loading = false;
      },
      error: () => {
        alert('Error loading equipment');
        this.router.navigate(['../equipment-list'], { relativeTo: this.route });
      }
    });
  }

  saveEquipment() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.equipment = {
      ...this.equipment,
      name: this.form.value.name,
      description: this.form.value.description,
      rentalPrice: this.form.value.rentalPrice,
      equipmentType: this.form.value.equipmentType,
      quantity: this.form.value.quantity,
      availableQuantity: this.form.value.availableQuantity
    };

    this.updateService.updateEquipment(this.equipment.equipmentID, this.equipment).subscribe({
      next: () => {
        alert('Successfully updated');
        this.router.navigate(['../equipment-list'], { relativeTo: this.route });
      },
      error: () => {
        alert('Error saving changes');
      }
    });
  }

  back() {
    this.router.navigate(['../../equipment-list'], { relativeTo: this.route });
  }

  hasInvalidQuantities(): boolean {
    return this.form?.hasError('availableQuantityExceedsQuantity') ?? false;
  }

  private availableQuantityWithinQuantity(control: AbstractControl): ValidationErrors | null {
    const quantity = Number(control.get('quantity')?.value);
    const availableQuantity = Number(control.get('availableQuantity')?.value);

    if (Number.isNaN(quantity) || Number.isNaN(availableQuantity)) {
      return null;
    }

    return availableQuantity <= quantity ? null : { availableQuantityExceedsQuantity: true };
  }
}
