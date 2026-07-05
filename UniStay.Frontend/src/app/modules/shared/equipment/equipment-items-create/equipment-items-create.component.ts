import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentItemCreateService } from '../../../../endpoints/equipment-endpoints/equipment-items-create-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-equipment-item-create',
  templateUrl: './equipment-items-create.component.html',
  styleUrls: ['./equipment-items-create.component.scss'],
  standalone: false,
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fieldAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class EquipmentItemCreateComponent implements OnInit {

  form!: FormGroup;
  equipmentId!: number;

  constructor(
    private fb: FormBuilder,
    private create: EquipmentItemCreateService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {

    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      serialNumber: ['', Validators.required],
      isAvailable: [true],

      assignedAt: [''],
      returnedAt: [''],
      location: [''],

      equipmentId: [this.equipmentId]
    });

    this.form.get('isAvailable')?.valueChanges.subscribe(value => {
      this.toggleFields(value);
    });

    this.toggleFields(true);
  }

  toggleFields(isAvailable: boolean) {

    const fields = ['assignedAt', 'returnedAt', 'location'];

    fields.forEach(name => {
      const control = this.form.get(name);

      if (isAvailable) {
        control?.clearValidators();
        control?.setValue(null); // 🔥 BITNO
        control?.disable();
      } else {
        control?.setValidators(Validators.required);
        control?.enable();
      }

      control?.updateValueAndValidity();
    });
  }

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let payload = this.form.getRawValue();

    // 🔥 KLJUČNI FIX
    if (payload.isAvailable) {

      // ako nema serial number → dodaj default
      if (!payload.serialNumber || payload.serialNumber.trim() === '') {
        payload.serialNumber = 'AVAILABLE';
      }

      // ostala polja moraju biti null (ne "")
      payload.assignedAt = null;
      payload.returnedAt = null;
      payload.location = null;
    }

    this.create.createItem(this.equipmentId, payload).subscribe({
      next: () => {
        alert('Item created successfully!');
        this.router.navigate(['../equipment-items-list', this.equipmentId], { relativeTo: this.route });
      },
      error: (err) => {
        console.log("ERROR:", err.error); // 🔍 ako opet pukne
        alert('Error creating item.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/employee/equipment/equipment-items-list', this.equipmentId]);
  }
}
