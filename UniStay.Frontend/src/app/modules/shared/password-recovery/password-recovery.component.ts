import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from '@angular/material/input';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  standalone:false
})
export class PasswordRecoveryComponent implements OnInit{
  step = 1; // 1 = enter email, 2 = questions, 3 = reset
  email = '';
  questions: any[] = [];
  answersForm!: FormGroup;
  resetForm!: FormGroup;
  tokenFromServer: string | null = null;
  rememberedEmails: string[] = [];

  constructor(private acct: AccountService, private fb: FormBuilder, private router:Router) {
    this.answersForm = this.fb.group({});
    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  const users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');

  this.rememberedEmails = users
    .map((x: any) => x.email)
    .filter((x: string) => !!x);
}

selectEmail(mail: string) {
  this.email = mail;
}

  start(email: string) {
    this.email = email;
    this.acct.getQuestionsForUser(email).subscribe({
      next: (qs:any) => {
        this.questions = qs || [];
        // create controls
        const group:any = {};
        this.questions.forEach((q:any) => {
    group['q' + this.getQuestionId(q)] = ['', Validators.required];
  });
        //qs.forEach((q:any)=> group['q'+q.questionId] = ['',[Validators.required]]);
        this.answersForm = this.fb.group(group);
        this.step = 2;
      },
      error: (err) => {
        // if user has no security questions, allow email flow instead
        alert(err?.error || 'No security questions set or user not found. You can use email reset.');
      }
    });
  }

  sendViaEmail() {
    this.acct.sendEmailToken(this.email).subscribe({
      next: () => { alert('Email with token sent (check inbox)'); this.step = 3; },
      error: (e) => alert('Error sending email token')
    });
  }

  submitAnswers() {
    const payload = {
      email: this.email,
      answers: this.questions.map(q => ({
        questionId: this.getQuestionId(q),
        answer: this.answersForm.controls['q'+this.getQuestionId(q)].value
      }))
    };
    this.acct.verifyAnswers(payload).subscribe({
      next: (res:any) => {
        // res may contain token depending on backend; we store it
        this.tokenFromServer = res?.resetToken;
        if (this.tokenFromServer) {
          this.resetForm.patchValue({ token: this.tokenFromServer });
        }
        this.step = 3;
      },
      error: (err) => alert(err?.error || 'Answers did not match')
    });
  }

resetPassword() {
  if (this.resetForm.invalid) { return; }

  const v = this.resetForm.value;

  if (v.newPassword !== v.confirm) {
    alert('Passwords do not match');
    return;
  }

  this.acct.resetPassword({ token: v.token, newPassword: v.newPassword })
    .subscribe({
      next: () => {
  alert('Password successfully changed!');

  // 🔥 UPDATE PASSWORD U localStorage
  let users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');
 console.log("RESET EMAIL:", this.email);
console.log("LOCAL USERS PRIJE:", users);
  const index = users.findIndex((x: any) => x.email.toLowerCase().trim() === this.email.toLowerCase().trim() );

  if (index !== -1) {
    users[index].password = v.newPassword;
    
    console.log("✅ Updated remembered user password:", users[index]);
  }
  else{
    users.push({email:this.email ,password:v.newPassword});
  }

  console.log("LOCAL USERS POSLIJE:", users);
localStorage.setItem('rememberedUsers', JSON.stringify(users));
  // redirect
  this.router.navigate(['/login']);
},
      error: (err) => {
        alert(err?.error || 'Error resetting password');
      }
    });
}

getQuestionId(question: any): number {
  return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID;
}

getQuestionText(question: any): string {
  return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
}
}
