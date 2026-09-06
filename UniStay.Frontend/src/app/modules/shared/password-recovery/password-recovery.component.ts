import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from '@angular/material/input';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecurityQuestion } from '../../../endpoints/auth-endpoints/account-security.models';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  standalone:false
})
export class PasswordRecoveryComponent implements OnInit{
  step = 1; 
  email = '';
  recoveryContextId = '';
  questions: SecurityQuestion[] = [];
  emailForm!: FormGroup;
  answersForm!: FormGroup;
  resetForm!: FormGroup;
  rememberedEmails: string[] = [];

constructor(
  private acct: AccountService,
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,
  private authService: MyAuthService,
  private snackBar: MatSnackBar
) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.answersForm = this.fb.group({});
    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    });
  }

ngOnInit(): void {
  const users = this.authService.getRememberedUsers();

  this.rememberedEmails = users
    .map(x => x.email)
    .filter((x: string) => !!x);

  const resetToken = this.route.snapshot.queryParamMap.get('token');

  if (resetToken?.trim()) {
    this.resetForm.patchValue({
      token: resetToken.trim()
    });

    this.step = 3;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }
}

selectEmail(mail: string) {
  this.email = mail;
  this.emailForm.patchValue({ email: mail });
}

  startSecurityQuestionsRecovery(email?: string) {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const emailValue = email ?? this.emailForm.value.email;
    this.email = emailValue;
    this.acct.startPasswordRecovery(this.email).subscribe({
      next: (response) => {
        this.recoveryContextId = response.recoveryContextId;
        this.loadRecoveryQuestions();
      },
      error: () => this.snackBar.open('Unable to start security-question recovery. Use email recovery.', 'OK', { duration: 3000 })
    });
  }

sendViaEmail() {
  if (this.emailForm.invalid) {
    this.emailForm.markAllAsTouched();
    return;
  }

  this.email = this.emailForm.value.email;

  this.acct.sendEmailToken(this.email).subscribe({
next: () => {
  this.snackBar.open(
    'If an account with this email exists, password reset instructions have been sent.',
    'OK',
    { duration: 7000 }
  );

  this.step = 3;
},
    error: () => {
      this.snackBar.open(
        'Unable to send password reset instructions. Please try again later.',
        'OK',
        { duration: 3000 }
      );
    }
  });
}

submitAnswers() {
  if (this.answersForm.invalid) {
    this.answersForm.markAllAsTouched();
    return;
  }

  const payload = {
    recoveryContextId: this.recoveryContextId,
    answers: this.questions.map(q => ({
      questionId: this.getQuestionId(q),
      answer: this.answersForm.controls['q' + this.getQuestionId(q)].value
    }))
  };

  this.acct.verifyAnswers(payload).subscribe({
    next: () => {
      this.snackBar.open(
        'Security answers verified. A password reset link and token have been sent to your email.',
        'OK',
        { duration: 7000 }
      );

      this.step = 3;
    },
    error: () => {
      this.snackBar.open(
        'Verification failed.',
        'OK',
        { duration: 3000 }
      );
    }
  });
}

private loadRecoveryQuestions(): void {
  if (!this.recoveryContextId) {
    this.snackBar.open('Unable to continue with security questions. Use email recovery.', 'OK', { duration: 3000 });
    return;
  }

  this.acct.getRecoveryQuestions(this.recoveryContextId).subscribe({
    next: (questions) => {
      this.questions = questions;
      if (!this.questions.length) {
        this.snackBar.open('Unable to continue with security questions. Use email recovery.', 'OK', { duration: 3000 });
        return;
      }

      const group: Record<string, unknown[]> = {};
      this.questions.forEach(q => {
        group['q' + this.getQuestionId(q)] = ['', Validators.required];
      });
      this.answersForm = this.fb.group(group);
      this.step = 2;
    },
    error: () => this.snackBar.open('Unable to continue with security questions. Use email recovery.', 'OK', { duration: 3000 })
  });
}

backToOptions(): void {
  this.step = 1;
  this.questions = [];
  this.recoveryContextId = '';
  this.answersForm = this.fb.group({});
}

resetPassword() {
  if (this.resetForm.invalid) { return; }

  const v = this.resetForm.value;

  if (v.newPassword !== v.confirm) {
    this.snackBar.open('Passwords do not match', 'OK', { duration: 3000 });
    return;
  }

  this.acct.resetPassword({ token: v.token, newPassword: v.newPassword })
    .subscribe({
      next: () => {
        this.snackBar.open('Password successfully changed!', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err?.error || 'Error resetting password', 'OK', { duration: 3000 });
      }
    });
}

getQuestionId(question: SecurityQuestion): number {
  return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID ?? 0;
}

getQuestionText(question: SecurityQuestion): string {
  return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
}
}
