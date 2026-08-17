import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityQuestionsAddComponent } from './security-questions-add/security-questions-add.component';
import { SecurityQuestionsAnswerComponent } from './security-questions-answer/security-questions-answer.component';


const routes: Routes = [
  { path: 'security-questions-add', component: SecurityQuestionsAddComponent },
  { path: 'security-questions-answer', component: SecurityQuestionsAnswerComponent },
  { path: 'security-querstions-answer', redirectTo: 'security-questions-answer', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityQuestionsRoutingModule {}
