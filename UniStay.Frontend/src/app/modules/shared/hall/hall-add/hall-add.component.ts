import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HallGetByIdEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-by-id-endpoint.service';
import { HallUpdateEndpointService } from '../../../../endpoints/hall-endpoints/hall-update-endpoint.service';
import { HallCreateEndpointService } from '../../../../endpoints/hall-endpoints/hall-create-endpoint.service';
import { HallGetAllEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-all-endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime,distinctUntilChanged,switchMap } from 'rxjs';
import { of } from 'rxjs';
import { AutocompleteEndpointService } from '../../../../endpoints/autocomplete/autocomplete-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppLanguage, LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-hall-add',
  templateUrl: './hall-add.component.html',
  styleUrls: ['./hall-add.component.scss'],
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

export class HallAddComponent implements OnInit {
  form!: FormGroup;
  hallId!: number | null;
  nameSuggestions:string[]=[];
  autosaveTimer:any;
  isAddMode = false;
  loading = false;
    isLoginPage = false;
  currentLanguage: AppLanguage = 'bs';
  readonly languages: { code: AppLanguage; labelKey: string }[] = [
    { code: 'bs', labelKey: 'HALL.LANGUAGE_BS' },
    { code: 'en', labelKey: 'HALL.LANGUAGE_EN' }
  ];

  isSaving=false;
  


  constructor(
    private fb: FormBuilder,
    private hallGetByIdService: HallGetByIdEndpointService,
    private hallUpdateService: HallUpdateEndpointService,
    private hallCreateService: HallCreateEndpointService,
    private hallGetAllService:HallGetAllEndpointService,
    private route: ActivatedRoute,
    private snackBar:MatSnackBar,
    private router: Router,
    private autocompleteService:AutocompleteEndpointService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();

    this.form = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      availableFrom: ['', Validators.required],
      availableTo: ['', Validators.required],
      isAvailable: [true]
    });

    this.form.valueChanges
.pipe(
  debounceTime(1500)
)
.subscribe(value => {

  if (this.form.invalid) return;

  const hallData = this.form.value;

  this.isSaving=true;

  if (this.hallId) {

    this.hallUpdateService.updateHall(this.hallId, hallData)
      .subscribe(()=>{
        this.isSaving=false;
      });

  } else {

    this.hallCreateService.createHall(hallData)
      .subscribe((res:any) => {

        if(res?.hallID){
          this.hallId = res.hallID;
          this.isAddMode = true;
        }

        this.isSaving=false;

      });

  }

});

    this.hallId = Number(this.route.snapshot.paramMap.get('id'));
    this.isAddMode = !!this.hallId;

    if (this.isAddMode) {
      this.loadHall();
    }


  this.form.get('name')?.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (!value || value.length < 1) {
        return of([]);
      }

      
       return this.autocompleteService.getSuggestions('halls',value);
   
    })
  ).subscribe(results => {
    this.nameSuggestions = results;
  });

}
  onNameSelected(value: string) {
  this.form.get('name')?.setValue(value);
}

  loadHall(): void {
    this.loading = true;
    this.hallGetByIdService.getHallById(this.hallId!).subscribe({
      next: (hall) => {
        this.form.patchValue(hall);
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(
            this.languageService.instant('HALL.ERROR_LOAD'),'OK',
            {duration:3000}
          );
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const hallData = this.form.value;

    this.loading = true;

    if (this.isAddMode) {
      this.hallUpdateService.updateHall(this.hallId!, hallData).subscribe({
        next: () => {
          this.snackBar.open(
            this.languageService.instant('HALL.SUCCESS_UPDATE'),'OK',
            {duration:3000}
          );
          this.router.navigate(['../hall-list'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            this.languageService.instant('HALL.ERROR_UPDATE'),'OK',
            {duration:3000}
          );
          this.loading = false;
        }
      });
    } else {
      this.hallCreateService.createHall(hallData).subscribe({
        next: () => {
          this.snackBar.open(
            this.languageService.instant('HALL.SUCCESS_ADD'),'OK',
            {duration:3000}
          );
          this.router.navigate(['../hall-list'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            this.languageService.instant('HALL.ERROR_ADD'),'OK',
            {duration:3000}
          );
          this.loading = false;
        }
      });
    }
  }

  changeLanguage(language: AppLanguage): void {
    this.currentLanguage = language;
    this.languageService.setLanguage(language);
  }

  back(): void {
    this.router.navigate(['../hall-list'], { relativeTo: this.route });
  }

}
