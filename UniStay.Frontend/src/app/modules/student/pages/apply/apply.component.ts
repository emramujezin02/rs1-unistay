import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subject, merge, switchMap, takeUntil, debounceTime } from 'rxjs';
import { ApplicationEndpointService } from '../../../../endpoints/application-endpoints/application-endpoint.service';
import { ApplicationFacadeService } from '../../../../endpoints/application-endpoints/application-facade.service';
import { FileUploadEndpointService } from '../../../../endpoints/file-upload-endpoints/file-upload-endpoint.service';
import { MyConfig } from '../../../../my-config';
import { gpaEligibleValidator } from '../../../../core/validators/availability-validators';

interface DocumentEntry {
  labelKey: string;
  required: boolean;
  fileName: string | null;
  uploadedUrl: string | null;
  uploading: boolean;
  progress: number;
  uploadError: string | null;
}

@Component({
  selector: 'app-apply',
  standalone: false,
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly draftSaved = signal(false);
  private draftTimer: ReturnType<typeof setTimeout> | null = null;

  academicForm!: FormGroup;
  roomForm!: FormGroup;
  prefsForm!: FormGroup;

  readonly yearOptions = [1, 2, 3, 4, 5, 6];
  readonly roomTypes = ['Single', 'Double', 'Triple'];
  readonly roomTypeLabelKeys: Record<string, string> = {
    Single: 'STUDENT.APPLICATION_FORM.ROOM_TYPES.SINGLE',
    Double: 'STUDENT.APPLICATION_FORM.ROOM_TYPES.DOUBLE',
    Triple: 'STUDENT.APPLICATION_FORM.ROOM_TYPES.TRIPLE'
  };

  documents: DocumentEntry[] = [
    { labelKey: 'STUDENT.APPLICATION_FORM.DOCUMENTS.IDENTITY', required: true, fileName: null, uploadedUrl: null, uploading: false, progress: 0, uploadError: null },
    { labelKey: 'STUDENT.APPLICATION_FORM.DOCUMENTS.ENROLLMENT', required: true, fileName: null, uploadedUrl: null, uploading: false, progress: 0, uploadError: null },
    { labelKey: 'STUDENT.APPLICATION_FORM.DOCUMENTS.TRANSCRIPT', required: false, fileName: null, uploadedUrl: null, uploading: false, progress: 0, uploadError: null },
    { labelKey: 'STUDENT.APPLICATION_FORM.DOCUMENTS.MEDICAL', required: false, fileName: null, uploadedUrl: null, uploading: false, progress: 0, uploadError: null }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    public facade: ApplicationFacadeService,
    private applicationApi: ApplicationEndpointService,
    private fileUploadApi: FileUploadEndpointService
  ) {}

  ngOnInit(): void {
    this.facade.loadMyApplications().subscribe({
      next: () => {
        if (!this.facade.canApply() && !this.facade.loading()) {
          this.router.navigate(['/student/dashboard']);
        }
      }
    });

    const draft = this.facade.draft();

    this.academicForm = this.fb.group({
      yearOfStudy: [draft.yearOfStudy ?? '', [Validators.required, Validators.min(1), Validators.max(6)]],
      gpaScore: this.fb.control(
        draft.gpaScore ?? '',
        {
          validators: [Validators.min(0), Validators.max(10)],
          asyncValidators: [gpaEligibleValidator(this.applicationApi)],
          updateOn: 'blur'
        }
      ),
      phoneNumber: [draft.phoneNumber ?? '']
    });

    this.roomForm = this.fb.group({
      preferredRoomType: [draft.preferredRoomType ?? '', Validators.required],
      selectedRoomId: [draft.selectedRoomId ?? null],
      selectedRoomNumber: [draft.selectedRoomNumber ?? null]
    });

    this.prefsForm = this.fb.group({
      specialRequirements: [draft.specialRequirements ?? ''],
      notes: [draft.notes ?? '']
    });

    if (draft.documentNames?.length) {
      draft.documentNames.forEach((name, index) => {
        if (this.documents[index]) {
          this.documents[index].fileName = name;
        }
      });
    }

    const params = this.route.snapshot.queryParamMap;
    const roomId = params.get('roomId');
    const roomNumber = params.get('roomNumber');
    const roomType = params.get('roomType');

    if (roomId && roomNumber) {
      this.roomForm.patchValue({
        selectedRoomId: roomId,
        selectedRoomNumber: roomNumber,
        preferredRoomType: roomType ?? this.roomForm.value.preferredRoomType
      });
    }

    merge(
      this.academicForm.valueChanges,
      this.roomForm.valueChanges,
      this.prefsForm.valueChanges
    ).pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => this.autosaveDraft());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.draftTimer) {
      clearTimeout(this.draftTimer);
    }
  }

  goToRoomBrowser(): void {
    this.saveDraft();
    this.router.navigate(['/student/rooms'], { queryParams: { selecting: 'true' } });
  }

  clearSelectedRoom(): void {
    this.roomForm.patchValue({
      selectedRoomId: null,
      selectedRoomNumber: null
    });
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    input.value = '';

    const doc = this.documents[index];
    doc.fileName = file.name;
    doc.uploading = true;
    doc.progress = 0;
    doc.uploadedUrl = null;
    doc.uploadError = null;

    this.fileUploadApi.upload(file).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: uploadEvent => {
        if (uploadEvent.type === 'progress') {
          doc.progress = uploadEvent.percent;
        } else {
          doc.progress = 100;
          doc.uploading = false;
          doc.uploadedUrl = `${MyConfig.baseUrl}${uploadEvent.url}`;
          this.saveDraft();
        }

        this.cdr.detectChanges();
      },
      error: error => {
        doc.uploading = false;
        doc.progress = 0;
        doc.uploadError = error?.message ?? this.translate.instant('STUDENT.APPLICATION_FORM.MESSAGES.UPLOAD_FAILED');
        this.cdr.detectChanges();
      }
    });
  }

  get anyUploading(): boolean {
    return this.documents.some(document => document.uploading);
  }

  get requiredDocsMissing(): boolean {
    return this.documents.some(document => document.required && !document.uploadedUrl);
  }

  get gpaPending(): boolean {
    return this.academicForm?.get('gpaScore')?.pending ?? false;
  }

  submit(): void {
    if (this.academicForm.invalid || this.roomForm.invalid || this.anyUploading) {
      return;
    }

    const documentNames = this.documents
      .filter(document => document.uploadedUrl)
      .map(document => `${document.fileName}|${document.uploadedUrl}`)
      .join(',');

    this.facade.submitApplication({
      preferredRoomType: this.roomForm.value.preferredRoomType,
      preferredRoomId: this.roomForm.value.selectedRoomId || null,
      yearOfStudy: Number(this.academicForm.value.yearOfStudy),
      gpaScore: this.academicForm.value.gpaScore ? Number(this.academicForm.value.gpaScore) : null,
      phoneNumber: this.academicForm.value.phoneNumber || null,
      specialRequirements: this.prefsForm.value.specialRequirements || null,
      documentNames: documentNames || null,
      notes: this.prefsForm.value.notes || null
    }).pipe(
      switchMap(() => this.facade.loadMyApplications())
    ).subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant('STUDENT.APPLICATION_FORM.MESSAGES.SUBMIT_SUCCESS'),
          this.translate.instant('common.close'),
          { duration: 4000 }
        );
        this.router.navigate(['/student/dashboard']);
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('STUDENT.APPLICATION_FORM.MESSAGES.SUBMIT_ERROR'),
          this.translate.instant('common.close'),
          { duration: 4000 }
        );
      }
    });
  }

  back(): void {
    this.router.navigate(['/student/dashboard']);
  }

  private autosaveDraft(): void {
    this.saveDraft();
    this.draftSaved.set(true);

    if (this.draftTimer) {
      clearTimeout(this.draftTimer);
    }

    this.draftTimer = setTimeout(() => this.draftSaved.set(false), 2000);
  }

  private saveDraft(): void {
    this.facade.saveDraft({
      yearOfStudy: this.academicForm.value.yearOfStudy || null,
      gpaScore: this.academicForm.value.gpaScore || null,
      phoneNumber: this.academicForm.value.phoneNumber || null,
      preferredRoomType: this.roomForm.value.preferredRoomType,
      selectedRoomId: this.roomForm.value.selectedRoomId,
      selectedRoomNumber: this.roomForm.value.selectedRoomNumber,
      selectedRoomType: this.roomForm.value.preferredRoomType,
      specialRequirements: this.prefsForm.value.specialRequirements || null,
      notes: this.prefsForm.value.notes || null,
      documentNames: this.documents.map(document => document.fileName ?? '')
    });
  }
}
