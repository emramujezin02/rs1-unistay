import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentGetByIdEndpointService } from '../../../../endpoints/equipment-endpoints/equpiment-get-by-id-endpoint.service';
import { EquipmentUpdateEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-update-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-equipment-update',
  templateUrl: './equipment-update.component.html',
  styleUrls: ['./equipment-update.component.scss'],
  standalone: false,
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
export class EquipmentUpdateComponent implements OnInit {

  equipment: any = {};
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private getByIdService: EquipmentGetByIdEndpointService,
    private updateService: EquipmentUpdateEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.getByIdService.getEquipmentById(id).subscribe({
      next: (data) => {
        console.log('Equipment API response:', data);

        this.equipment = data;

        // Ako jednog dana dodaš datum — splitaj ga ovako:
        // this.equipment.someDate = this.equipment.someDate?.split('T')[0] || null;

        this.loading = false;
      },
      error: () => {
        alert('Error loading equipment');
        this.router.navigate(['../equipment-list'], { relativeTo: this.route });
      }
    });
  }

  saveEquipment() {
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
}
