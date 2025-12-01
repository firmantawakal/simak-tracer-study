export interface Question {
  id: string;
  type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
  question: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  isActive: boolean;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSurveyData {
  title: string;
  description?: string;
  questions: Question[];
  deadline?: string;
}

export interface SurveyWithStats extends Survey {
  _count: {
    responses: number;
    tokens: number;
  };
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  tokenHash: string;
  answers: Answer[];
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  answer: string | string[] | number;
}