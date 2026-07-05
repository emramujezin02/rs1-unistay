import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentItemsUpdateService } from '../../../../endpoints/equipment-endpoints/equipment-items-update-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-equipment-item-update',
  templateUrl: './equipment-items-update.component.html',
  styleUrls: ['./equipment-items-update.component.scss'],
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
export class EquipmentItemUpdateComponent implements OnInit {

  form!: FormGroup;
  itemId!: number;
  equipmentId!: number;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private itemUpdateService: EquipmentItemsUpdateService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {

    // ✅ FIX 1: uzmi ID ispravno
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      serialNumber: ['', Validators.required],
      isAvailable: [true],
      assignedAt: [''],
      returnedAt: [''],
      location: ['']
    });

    // ✅ FIX 2: guard da ne briše podatke dok se load-a
    this.form.get('isAvailable')?.valueChanges.subscribe(value => {

      if (this.loading) return;
      this.toggleAvailability(value);

      const fields = ['assignedAt', 'returnedAt', 'location'];

      fields.forEach(f => {
        const control = this.form.get(f);

        if (value) {

  control?.setValue('');
  control?.clearValidators();
  control?.disable();   // 🔥 BLOKIRA KUCAJ

} else {

  control?.enable();    // 🔥 VRATI INPUT

  control?.setValidators(Validators.required);
}

        control?.updateValueAndValidity();
      });

    });

    this.loadItem();
  }

  loadItem() {
    this.loading = true;

    this.itemUpdateService.getRecord(this.itemId).subscribe({
      next: item => {

        // ✅ FIX 3: uzmi equipmentId za navigaciju
        this.equipmentId = item.equipmentID;

        this.form.patchValue({
          serialNumber: item.serialNumber,
          isAvailable: item.isAvailable,
          assignedAt: item.assignedAt ? item.assignedAt.split('T')[0] : '',
          returnedAt: item.returnedAt ? item.returnedAt.split('T')[0] : '',
          location: item.location
        });

        this.toggleAvailability(item.isAvailable);

        this.loading = false;
      },
      error: () => {
        alert("Error loading item");
        this.loading = false;
      }
    });
  }

  toggleAvailability(isAvailable: boolean) {

  const fields = ['assignedAt', 'returnedAt', 'location'];

  fields.forEach(f => {
    const control = this.form.get(f);

    if (isAvailable) {
      control?.setValue('');
      control?.clearValidators();
      control?.disable();
    } else {
      control?.enable();
      control?.setValidators(Validators.required);
    }

    control?.updateValueAndValidity();
  });
}

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let payload = { ...this.form.value };

    // validation
    if (!payload.isAvailable) {
      if (!payload.assignedAt || !payload.returnedAt || !payload.location) {
        alert("Fill all fields for occupied item!");
        return;
      }
    }

    // convert dates
    if (payload.assignedAt) {
      payload.assignedAt = new Date(payload.assignedAt).toISOString();
    }

    if (payload.returnedAt) {
      payload.returnedAt = new Date(payload.returnedAt).toISOString();
    }

    // available → clear fields
    if (payload.isAvailable) {
      payload.assignedAt = null;
      payload.returnedAt = null;
      payload.location = null;
    }

    this.itemUpdateService.updateItem(this.itemId, payload).subscribe({
      next: () => {
        alert("Item updated successfully");

        // ✅ FIX 4: pravi ID
        this.router.navigate(['/equipment-items-list', this.equipmentId], { relativeTo: this.route });
      },
      error: (err) => {
        console.log("ERROR:", err.error);
        alert("Error updating item");
      }
    });
  }

  back() {
    this.router.navigate(['/employee/equipment/equipment-items-list', this.equipmentId], { relativeTo: this.route });
  }
}
