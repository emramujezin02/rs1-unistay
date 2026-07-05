import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentCreateEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-create-endpoint.service';
import { EquipmentUpdateEndpointService } from '../../../../endpoints/equipment-endpoints/equipment-update-endpoint.service';
import { EquipmentGetByIdEndpointService } from '../../../../endpoints/equipment-endpoints/equpiment-get-by-id-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutocompleteEndpointService, AutocompleteOption } from '../../../../endpoints/autocomplete/autocomplete-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({ selector:'app-equipment-add', 
  templateUrl:'./equipment-add.component.html',
  styleUrls:['./equipment-add.component.scss'],
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
export class EquipmentAddComponent implements OnInit {
  form!: FormGroup;
  id: number | null = null;
  isEdit = false;
  loading = false;
  nameSuggestions:AutocompleteOption[]=[];
  typeSuggestions:AutocompleteOption[]=[];
  

  constructor(private fb: FormBuilder,
              private createSvc: EquipmentCreateEndpointService,
              private updateSvc: EquipmentUpdateEndpointService,
              private getById: EquipmentGetByIdEndpointService,
              private route: ActivatedRoute,
              private router: Router,
              private autocompleteService:AutocompleteEndpointService,
              private http:HttpClient
            ) {}

  ngOnInit(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, [Validators.required, Validators.min(0)]],
      availableQuantity: [1, [Validators.required, Validators.min(0)]],
      rentalPrice: [''],
      equipmentType: ['']
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;
    if (this.isEdit) this.load();

          this.form.get('name')?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => {
              if (!value || value.length < 1) {
                return of([]);
              }
        
              
               return this.autocompleteService.getEquipmentSuggestions('equipment',value);
           
            })
          ).subscribe(results => {
            this.nameSuggestions = results;
          });

                this.form.get('equipmentType')?.valueChanges.pipe(
                  debounceTime(300),
                  distinctUntilChanged(),
                  switchMap(value => {
                    if (!value || value.length < 1) {
                      return of([]);
                    }
              
                     return this.autocompleteService.getEquipmentSuggestions('equipmenttype',value);
                 
                  })
                ).subscribe(results => {
                  this.typeSuggestions = results;
                });
  }

      onNameSelected(value: string) {
  this.form.get('name')?.setValue(value);
}

      onTypeSelected(value: string) {
  this.form.get('equipmentType')?.setValue(value);
}

  load(){
    this.getById.getEquipmentById(this.id!).subscribe({
      next: (d:any) => {
        this.form.patchValue(d);
      },
      error: ()=> { alert('Error loading'); this.router.navigate(['../equipment-list'], { relativeTo: this.route }); }
    });
  }

  submit(){
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value;
    if (this.isEdit){
      this.updateSvc.updateEquipment(this.id!, payload).subscribe({
        next: ()=> { alert('Updated'); this.router.navigate(['../equipment-list'], { relativeTo: this.route }); },
        error: ()=> alert('Error updating')
      });
    } else {
      this.createSvc.createEquipment(payload).subscribe({
        next: ()=> { alert('Created'); this.router.navigate(['../equipment-list'], { relativeTo: this.route }); },
        error: ()=> alert('Error creating')
      });
    }
  }

  back() {
    this.router.navigate(['../equipment-list'], { relativeTo: this.route });
  }
}
