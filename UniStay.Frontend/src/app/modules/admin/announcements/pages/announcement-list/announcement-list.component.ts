import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  AnnouncementAudience,
  AnnouncementDto
} from '../../../../../endpoints/announcement-endpoints/announcement.models';
import { AnnouncementEndpointService } from '../../../../../endpoints/announcement-endpoints/announcement-endpoint.service';

function contentRequired(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').toString();
  const text = value.replace(/<[^>]*>/g, '').trim();
  return text.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-announcement-list',
  standalone: false,
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss'
})
export class AnnouncementListComponent implements OnInit {
  @ViewChild('contentEditor') private contentEditor?: ElementRef<HTMLElement>;

  readonly announcements = signal<AnnouncementDto[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly showForm = signal(false);

  readonly page = signal(1);
  readonly pageSize = 10;
  readonly displayedColumns = ['title', 'audience', 'expires', 'createdBy', 'createdAt', 'actions'];

  readonly audienceOptions: { value: AnnouncementAudience; labelKey: string }[] = [
    { value: 'Everyone', labelKey: 'ADMIN.ANNOUNCEMENTS.AUDIENCE_EVERYONE' },
    { value: 'Students', labelKey: 'ADMIN.ANNOUNCEMENTS.AUDIENCE_STUDENTS' },
    { value: 'Employees', labelKey: 'ADMIN.ANNOUNCEMENTS.AUDIENCE_EMPLOYEES' },
    { value: 'StudentsAndEmployees', labelKey: 'ADMIN.ANNOUNCEMENTS.AUDIENCE_STUDENTSANDEMPLOYEES' }
  ];

  editorFocused = false;
  form!: FormGroup;

  constructor(
    private announcementEndpoint: AnnouncementEndpointService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', contentRequired],
      audience: ['Everyone', Validators.required],
      expiresAt: [null]
    });

    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.announcementEndpoint.getAll(this.page(), this.pageSize).subscribe({
      next: result => {
        this.announcements.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open(this.t('ADMIN.ANNOUNCEMENTS.LOAD_ERROR'), this.t('ADMIN.ANNOUNCEMENTS.CLOSE'), { duration: 3000 });
      }
    });
  }

  onPageChange(pageIndex: number): void {
    this.page.set(pageIndex + 1);
    this.load();
  }

  toggleForm(): void {
    this.showForm.update(value => !value);

    if (!this.showForm()) {
      this.form.reset({ audience: 'Everyone' });
      this.clearEditorContent();
    }
  }

  applyEditorCommand(command: string, value?: string): void {
    this.focusEditor();
    document.execCommand(command, false, value);
    this.syncEditorContent();
  }

  applyEditorBlock(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.applyEditorCommand('formatBlock', value);
  }

  createEditorLink(): void {
    const url = window.prompt('https://');

    if (!url) {
      return;
    }

    this.applyEditorCommand('createLink', url);
  }

  syncEditorContent(): void {
    const content = this.contentEditor?.nativeElement.innerHTML ?? '';
    const control = this.form.get('content');

    control?.setValue(content);
    control?.markAsDirty();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    const { title, content, audience, expiresAt } = this.form.value;

    this.announcementEndpoint.create({
      title,
      content,
      audience,
      expiresAt: expiresAt || null
    }).subscribe({
      next: () => {
        this.form.reset({ audience: 'Everyone' });
        this.showForm.set(false);
        this.submitting.set(false);
        this.page.set(1);
        this.load();
        this.snackBar.open(this.t('ADMIN.ANNOUNCEMENTS.POST_SUCCESS'), this.t('ADMIN.ANNOUNCEMENTS.CLOSE'), { duration: 3000 });
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open(this.t('ADMIN.ANNOUNCEMENTS.POST_ERROR'), this.t('ADMIN.ANNOUNCEMENTS.CLOSE'), { duration: 3000 });
      }
    });
  }

  onDelete(announcement: AnnouncementDto): void {
    const confirmed = window.confirm(this.t('ADMIN.ANNOUNCEMENTS.DELETE_CONFIRM', { title: announcement.title }));

    if (!confirmed) {
      return;
    }

    this.announcementEndpoint.delete(announcement.announcementId).subscribe({
      next: () => {
        this.announcements.update(items =>
          items.filter(item => item.announcementId !== announcement.announcementId)
        );
        this.totalCount.update(value => Math.max(value - 1, 0));
        this.snackBar.open(this.t('ADMIN.ANNOUNCEMENTS.DELETE_SUCCESS'), this.t('ADMIN.ANNOUNCEMENTS.CLOSE'), { duration: 3000 });
      },
      error: () => this.snackBar.open(this.t('ADMIN.ANNOUNCEMENTS.DELETE_ERROR'), this.t('ADMIN.ANNOUNCEMENTS.CLOSE'), { duration: 3000 })
    });
  }

  audienceColor(audience: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (audience) {
      case 'Students':
        return 'primary';
      case 'Employees':
        return 'accent';
      case 'StudentsAndEmployees':
        return 'warn';
      default:
        return undefined;
    }
  }

  audienceLabelKey(audience: string): string {
    return this.audienceOptions.find(option => option.value === audience)?.labelKey ?? audience;
  }

  stripHtml(content: string): string {
    return content ? content.replace(/<[^>]*>/g, '').trim() : '';
  }

  private t(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  private focusEditor(): void {
    this.contentEditor?.nativeElement.focus();
  }

  private clearEditorContent(): void {
    if (this.contentEditor) {
      this.contentEditor.nativeElement.innerHTML = '';
    }
  }
}
