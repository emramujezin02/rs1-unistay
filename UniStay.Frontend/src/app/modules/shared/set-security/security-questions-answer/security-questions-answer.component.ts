import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { AnsweredSecurityQuestion, SecurityQuestion } from '../../../../endpoints/auth-endpoints/account-security.models';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-security-questions-answer',
  templateUrl: './security-questions-answer.component.html',
  styleUrls: ['./security-questions-answer.component.scss'],
  standalone:false
})
export class SecurityQuestionsAnswerComponent implements OnInit {

  questions: SecurityQuestion[] = [];
  form!: FormGroup;

  constructor(
    private acct: AccountService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

loadQuestions() {
  this.acct.getAllQuestions().subscribe({
    next: (all: SecurityQuestion[]) => {

      this.acct.getAnsweredQuestions().subscribe({
        next: (answered: AnsweredSecurityQuestion[]) => {

          const answeredIds = answered.map(x =>
            x.questionId ?? x.QuestionId ?? x.securityQuestionID ?? x.securityQuestionsID
          );

          this.questions = all.filter(q =>{
            const id=q.questionId??q.QuestionId??q.securityQuestionID??q.securityQuestionsID;
            return !answeredIds.includes(id);}
          );

          const group: Record<string, unknown[]> = {};

          this.questions.forEach(q => {
            const id = this.getQuestionId(q);
            group['question_' + id] = ['', Validators.required];
          });

          this.form = this.fb.group(group);

        },
        error: () => {
          this.questions = [];
          this.form = this.fb.group({});
          this.snackBar.open('Unable to load security question state.', 'OK', { duration: 3000 });
        }
      });

    }
  });
}

  save() {
    if (this.form.invalid) {
      this.snackBar.open('Fill all fields!', 'OK', { duration: 3000 });
      return;
    }

    const formValue = this.form.value;

    const payload = {
      answers: this.questions.map(q => ({
        questionId: this.getQuestionId(q),
        answer: formValue['question_' + this.getQuestionId(q)]
      }))
    };

    this.acct.setSecurityAnswers(payload).subscribe({
      next: () => {
        this.snackBar.open('Security questions saved successfully!', 'OK', { duration: 3000 });
      },
      error: (e) => {
        this.snackBar.open(e?.error || 'Error saving questions', 'OK', { duration: 3000 });
      }
    });
  }

  getQuestionId(question: SecurityQuestion | AnsweredSecurityQuestion): number {
    return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID ?? 0;
  }

  getQuestionText(question: SecurityQuestion): string {
    return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
  }
}
