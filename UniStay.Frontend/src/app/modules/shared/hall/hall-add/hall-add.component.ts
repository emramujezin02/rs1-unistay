import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HallGetByIdEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-by-id-endpoint.service';
import { HallUpdateEndpointService } from '../../../../endpoints/hall-endpoints/hall-update-endpoint.service';
import { HallCreateEndpointService } from '../../../../endpoints/hall-endpoints/hall-create-endpoint.service';
import { HallGetAllEndpointService } from '../../../../endpoints/hall-endpoints/hall-get-all-endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
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

export class HallAddComponent implements OnInit, OnDestroy {
  private readonly draftStorageKey = 'unistay_hall_add_draft';
  readonly minCapacity = 1;
  readonly maxCapacity = 1000;
  readonly nameMaxLength = 100;
  readonly descriptionMaxLength = 1000;

  form!: FormGroup;
  hallId!: number | null;
  nameSuggestions:string[]=[];
  private draftSavedTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroy$ = new Subject<void>();
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
      name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
      capacity: ['', [Validators.required, Validators.min(this.minCapacity), Validators.max(this.maxCapacity)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.descriptionMaxLength)]],
      availableFrom: ['', Validators.required],
      availableTo: ['', Validators.required],
      isAvailable: [true]
    }, { validators: this.availableDateRangeValidator });

    this.hallId = Number(this.route.snapshot.paramMap.get('id'));
    this.isAddMode = !!this.hallId;

    if (!this.isAddMode) {
      this.restoreHallDraft();
    }

    this.form.valueChanges
      .pipe(
        debounceTime(1500),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.saveHallDraft());

    if (this.isAddMode) {
      this.loadHall();
    }


  this.form.get('name')?.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$),
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

  ngOnDestroy(): void {
    if (this.draftSavedTimer) {
      clearTimeout(this.draftSavedTimer);
    }

    this.destroy$.next();
    this.destroy$.complete();
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
          this.clearHallDraft();
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

  private saveHallDraft(): void {
    if (this.isAddMode) {
      return;
    }

    try {
      localStorage.setItem(this.draftStorageKey, JSON.stringify(this.getHallDraftValue()));
      this.showDraftSavedIndicator();
    } catch (error) {
      console.error('Error saving hall draft', error);
      this.isSaving = false;
    }
  }

  private restoreHallDraft(): void {
    const rawDraft = localStorage.getItem(this.draftStorageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft);

      if (!draft || typeof draft !== 'object') {
        return;
      }

      this.form.patchValue({
        name: typeof draft.name === 'string' ? draft.name : '',
        capacity: draft.capacity ?? '',
        description: typeof draft.description === 'string' ? draft.description : '',
        availableFrom: typeof draft.availableFrom === 'string' ? draft.availableFrom : '',
        availableTo: typeof draft.availableTo === 'string' ? draft.availableTo : '',
        isAvailable: typeof draft.isAvailable === 'boolean' ? draft.isAvailable : true
      }, { emitEvent: false });
    } catch (error) {
      console.error('Error restoring hall draft', error);
      localStorage.removeItem(this.draftStorageKey);
    }
  }

  private clearHallDraft(): void {
    localStorage.removeItem(this.draftStorageKey);
  }

  private getHallDraftValue(): any {
    return {
      name: this.form.value.name,
      capacity: this.form.value.capacity,
      description: this.form.value.description,
      availableFrom: this.form.value.availableFrom,
      availableTo: this.form.value.availableTo,
      isAvailable: this.form.value.isAvailable
    };
  }

  private showDraftSavedIndicator(): void {
    this.isSaving = true;

    if (this.draftSavedTimer) {
      clearTimeout(this.draftSavedTimer);
    }

    this.draftSavedTimer = setTimeout(() => {
      this.isSaving = false;
      this.draftSavedTimer = null;
    }, 2000);
  }

}

