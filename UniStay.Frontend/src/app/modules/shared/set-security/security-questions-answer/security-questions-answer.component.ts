import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../endpoints/auth-endpoints/account-security-endpoint.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-security-questions-answer',
  templateUrl: './security-questions-answer.component.html',
  styleUrls: ['./security-questions-answer.component.scss'],
  standalone:false
})
export class SecurityQuestionsAnswerComponent implements OnInit {

  questions: any[] = [];
  form!: FormGroup;

  constructor(
    private acct: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log("ucitavanje komponenet");
    this.loadQuestions();
  }

loadQuestions() {
  const email = localStorage.getItem('email');

  if (!email) {
    alert("No email found");
    return;
  }

  this.acct.getAllQuestions().subscribe({
    next: (all: any[]) => {

      this.acct.getAnsweredQuestions(email).subscribe({
        next: (answered: any[]) => {

          console.log("IZVRSAVA SE");

          const answeredIds = answered.map(x =>
            x.questionId ?? x.QuestionId ?? x.securityQuestionID
          );

          this.questions = all.filter(q =>{
            const id=q.questionId??q.QuestionId??q.securityQuestionID;
            return !answeredIds.includes(id);}
          );

          console.log("ANSWERED IDS:", answeredIds);
console.log("FILTERED QUESTIONS:", this.questions);

          const group: any = {};

          this.questions.forEach(q => {
            const id = this.getQuestionId(q);
            group['question_' + id] = ['', Validators.required];
          });

          this.form = this.fb.group({email:[email,[Validators.required,Validators.email]],...group});

          console.log("ALL QUESTIONS:",all);
          console.log("ANSWERED QUESTIONS:",answered);
        },
        error: () => {
          console.log("NE IZVRSAVA SE");
          this.questions = all;

          const group: any = {};

          this.questions.forEach(q => {
            const id = this.getQuestionId(q);
            group['question_' + id] = ['', Validators.required];
          });

          this.form = this.fb.group({email:[email,[Validators.required,Validators.email]],...group});
        }
      });

    }
  });
}

  save() {
    if (this.form.invalid) return alert("Fill all fields!");

    const formValue = this.form.value;
    const userId = Number(localStorage.getItem('id') || 0);

    const payload = {
      userId,
      answers: this.questions.map(q => ({
        questionId: this.getQuestionId(q),
        answer: formValue['question_' + this.getQuestionId(q)]
      }))
    };

    this.acct.setSecurityAnswers(payload).subscribe({
      next: () => {
        alert("Security questions saved successfully!");
      },
      error: (e) => {
        alert(e?.error || "Error saving questions");
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
