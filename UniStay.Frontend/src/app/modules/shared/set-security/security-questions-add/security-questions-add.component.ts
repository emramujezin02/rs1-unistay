import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../../endpoints/auth-endpoints/account-security-endpoint.service';

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

  email: string = ''; // uzmi iz localStorage ili forme
  
  
  

  constructor(private acct: AccountService,private router:Router) { }

  ngOnInit(): void {

  //this.email = localStorage.getItem('email') || '';
  this.email = localStorage.getItem('email')?.trim() || '';

console.log("EMAIL KOJI SALJEM:", this.email);

if (!this.email) {
  alert("Email nije pronadjen u localStorage");
  return;
}

  this.acct.getAllQuestions()
    .subscribe(allQuestions => {

      // 🔥 uzmi answered pitanja
      this.acct.getAnsweredQuestions(this.email)
        .subscribe(answered => {

          const answeredIds = answered.map(x => this.getQuestionId(x));

          // 🔥 FILTER — samo neodgovorena
          this.questions = allQuestions.filter(q =>
            !answeredIds.includes(this.getQuestionId(q))
          );

          // pripremi answers samo za filtrirana pitanja
          this.answers = this.questions.map(q => ({
            questionId: this.getQuestionId(q),
            answer: ''
          }));

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
    const userId=parseInt(localStorage.getItem('id') || '0');

    const payload = {
      userId: userId,
      answers: this.answers.filter(x=>x.answer.trim()!=='')
    };

    console.log("userid:",userId,typeof userId);

    this.acct.setSecurityAnswers(payload)
      .subscribe({
        next: () => {alert('Sačuvano!'); this.router.navigate(['/login']);},
        error: err => console.error(err)
      });

      this.answers = this.answers.map(a => ({
          questionId: a.questionId,
          answer: ''
        }));

        this.currentIndex = 0;
  }

  getQuestionId(question: any): number {
    return question?.questionId ?? question?.QuestionId ?? question?.securityQuestionID ?? question?.securityQuestionsID;
  }

  getQuestionText(question: any): string {
    return question?.question ?? question?.Question ?? question?.text ?? question?.Text ?? '';
  }
}
