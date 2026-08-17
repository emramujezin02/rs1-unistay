import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-questions-add',
  styleUrls: ['./security-questions-add.component.scss'],
  templateUrl: './security-questions-add.component.html',
  standalone:false
})
export class SecurityQuestionsAddComponent implements OnInit {

  questions: any[] = [];
  currentIndex = 0;

  answers: { questionId: number, answer: string }[] = [];
  form!: FormGroup;

  email: string = ''; 
  
  
  

  constructor(private acct: AccountService, private fb: FormBuilder) { }

  ngOnInit(): void {
  this.form = this.fb.group({
    answers: this.fb.array([], { validators: this.atLeastOneAnswerValidator })
  });

  //this.email = localStorage.getItem('email') || '';
  this.email = localStorage.getItem('email')?.trim() || '';

console.log("EMAIL KOJI SALJEM:", this.email);

if (!this.email) {
  alert("Email is not found in localStorage");
  return;
}

  this.loadAvailableQuestions();
}

  private loadAvailableQuestions(): void {
  this.acct.getAllQuestions()
    .subscribe(allQuestions => {

      // ðŸ”¥ uzmi answered pitanja
      this.acct.getAnsweredQuestions(this.email)
        .subscribe(answered => {

          const answeredIds = answered.map(x => this.getQuestionId(x));

          // ðŸ”¥ FILTER â€” samo neodgovorena
          this.questions = allQuestions.filter(q =>
            !answeredIds.includes(this.getQuestionId(q))
          );

          this.currentIndex = 0;
          // pripremi answers samo za filtrirana pitanja
          this.answers = this.questions.map(q => ({
            questionId: this.getQuestionId(q),
            answer: ''
          }));
          this.buildAnswersForm();

        });

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
          alert('Save!');
          this.loadAvailableQuestions();
        },
        error: err => console.error(err)
      });
  }

  get answerControls(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  get currentAnswerControl(): AbstractControl | null {
    return this.answerControls.at(this.currentIndex) ?? null;
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

  getQuestionId(question: any): number {
    return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID;
  }

  getQuestionText(question: any): string {
    return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
  }
}
