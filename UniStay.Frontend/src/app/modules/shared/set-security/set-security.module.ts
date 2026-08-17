import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material';
import { SecurityQuestionsAddComponent } from './security-questions-add/security-questions-add.component';
import { SecurityQuestionsAnswerComponent } from './security-questions-answer/security-questions-answer.component';
import { SecurityQuestionsRoutingModule } from './set-security-routing.module';



@NgModule({
  declarations: [
    SecurityQuestionsAddComponent,
    SecurityQuestionsAnswerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SecurityQuestionsRoutingModule,
    MaterialModule
  ],
  exports: [
    SecurityQuestionsAddComponent,
    SecurityQuestionsAnswerComponent
  ]
})
export class SecurityQuestionsModule {}