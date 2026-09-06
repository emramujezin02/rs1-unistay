import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { SecurityAnswer, SecurityQuestion } from '../../../../endpoints/auth-endpoints/account-security.models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-security-questions-add',
  styleUrls: ['./security-questions-add.component.scss'],
  templateUrl: './security-questions-add.component.html',
  standalone:false
})
export class SecurityQuestionsAddComponent implements OnInit {

  questions: SecurityQuestion[] = [];
  currentIndex = 0;

  answers: SecurityAnswer[] = [];
  form!: FormGroup;

  email: string = ''; 
  isLoading = true;
  loadError = '';
  answeredQuestionsCount = 0;
  totalQuestionsCount = 0;
  

  constructor(private acct: AccountService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  this.form = this.fb.group({
    answers: this.fb.array([], { validators: this.atLeastOneAnswerValidator })
  });

  this.email = localStorage.getItem('email')?.trim() || '';

  this.loadAvailableQuestions();
}

  private loadAvailableQuestions(): void {
  this.isLoading = true;
  this.loadError = '';

  forkJoin({
    allQuestions: this.acct.getAllQuestions(),
    answered: this.acct.getAnsweredQuestions()
  }).subscribe({
    next: ({ allQuestions, answered }) => {
      const answeredIds = answered
        .map(x => this.getQuestionId(x))
        .filter(id => id > 0);

      this.totalQuestionsCount = allQuestions.length;
      this.answeredQuestionsCount = answeredIds.length;
      this.questions = allQuestions.filter(q =>
        !answeredIds.includes(this.getQuestionId(q))
      );

      this.currentIndex = 0;
      this.answers = this.questions.map(q => ({
        questionId: this.getQuestionId(q),
        answer: ''
      }));
      this.buildAnswersForm();
      this.isLoading = false;
    },
    error: () => {
      this.questions = [];
      this.answers = [];
      this.totalQuestionsCount = 0;
      this.answeredQuestionsCount = 0;
      this.buildAnswersForm();
      this.isLoading = false;
      this.loadError = 'Unable to load security questions. Please try again later.';
      this.snackBar.open(this.loadError, 'OK', { duration: 3000 });
    }
    });
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.syncAnswersFromForm();

    const payload = {
      answers: this.answers.filter(x=>x.answer.trim()!=='')
    };

    this.acct.setSecurityAnswers(payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Saved!', 'OK', { duration: 3000 });
          this.loadAvailableQuestions();
        },
        error: () => this.snackBar.open('Unable to save security answers. Please try again later.', 'OK', { duration: 3000 })
      });
  }

  get answerControls(): FormArray {
    return this.form.get('answers') as FormArray;
  }

get currentAnswerControl(): AbstractControl {
  return this.answerControls.at(this.currentIndex);
}



  private buildAnswersForm(): void {
    const controls = this.answers.map(answer =>
      this.fb.control(answer.answer, [Validators.minLength(2), Validators.maxLength(500)])
    );

    this.form.setControl('answers', this.fb.array(controls, { validators: this.atLeastOneAnswerValidator }));
  }

  private syncAnswersFromForm(): void {
    this.answers = this.answers.map((answer, index) => ({
      questionId: answer.questionId,
      answer: this.answerControls.at(index)?.value ?? ''
    }));
  }

  private atLeastOneAnswerValidator(control: AbstractControl): ValidationErrors | null {
    const values = (control.value ?? []) as string[];
    const hasAnswer = values.some(value => typeof value === 'string' && value.trim() !== '');

    return hasAnswer ? null : { noAnswers: true };
  }

  getQuestionId(question: SecurityQuestion): number {
    return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID ?? 0;
  }

  getQuestionText(question: SecurityQuestion): string {
    return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
  }

  get emptyTitle(): string {
    if (this.totalQuestionsCount === 0) {
      return 'No security questions are configured.';
    }

    if (this.answeredQuestionsCount >= this.totalQuestionsCount) {
      return 'Security questions are set.';
    }

    return 'No unanswered security questions available.';
  }

  get emptyMessage(): string {
    if (this.totalQuestionsCount === 0) {
      return 'Please try again later.';
    }

    if (this.answeredQuestionsCount >= this.totalQuestionsCount) {
      return 'You have answered all available security questions.';
    }

    return 'Refresh the page or try again later.';
  }
}
