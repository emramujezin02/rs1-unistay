export interface SecurityQuestion {
  questionId?: number;
  QuestionId?: number;
  securityQuestionID?: number;
  securityQuestionsID?: number;
  question?: string;
  Question?: string;
  text?: string;
  Text?: string;
}

export interface AnsweredSecurityQuestion {
  questionId?: number;
  QuestionId?: number;
  securityQuestionID?: number;
  securityQuestionsID?: number;
}

export interface SecurityAnswer {
  questionId: number;
  answer: string;
}

export interface SetSecurityAnswersRequest {
  userId?: number;
  answers: SecurityAnswer[];
}

export interface VerifySecurityAnswersRequest {
  recoveryContextId: string;
  answers: SecurityAnswer[];
}

export interface VerifySecurityAnswersResponse {
  success: boolean;
}

export interface SendPasswordResetTokenResponse {
  message: string;
  recoveryContextId: string;
}

export interface StartPasswordRecoveryResponse {
  message: string;
  recoveryContextId: string;
}
