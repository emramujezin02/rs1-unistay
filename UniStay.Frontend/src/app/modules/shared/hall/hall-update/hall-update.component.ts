import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HallGetByIdEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-by-id-endpoint.service';
import { HallUpdateEndpointService } from '../../../../endpoints/hall-endpoints/hall-update-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-hall-update',
  templateUrl: './hall-update.component.html',
  styleUrls: ['./hall-update.component.scss'],
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
export class HallUpdateComponent implements OnInit {

  hall: any = {};
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private hallGetByIdService: HallGetByIdEndpointService,
    private hallUpdateService: HallUpdateEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.hallGetByIdService.getHallById(id).subscribe({
      next: (data) => {
         console.log('API RESPONSE hall:', data);
        this.hall = data;
     this.hall.availableFrom = this.hall.availableFrom ? this.hall.availableFrom.split('T')[0] : null;
    this.hall.availableTo   = this.hall.availableTo   ? this.hall.availableTo.split('T')[0]   : null;


        this.loading = false;
      },
      error: () => {
        alert('Error loading hall');
        this.router.navigate(['../hall-list'], { relativeTo: this.route });
      }
    });
  }

  saveHall() {
    this.hallUpdateService.updateHall(this.hall.hallID, this.hall).subscribe({
      next: () => {
        alert('Successfully updated');
        this.router.navigate(['../hall-list'], { relativeTo: this.route });
      },
      error: () => alert('Error saving')
    });
  }

  back() {
    this.router.navigate(['../hall-list'], { relativeTo: this.route });
  }
}
