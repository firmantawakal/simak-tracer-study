export interface Response {
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

export interface FormattedAnswer {
  questionId: string;
  question: string;
  answer: string | string[] | number;
  type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
}

export interface ResponseWithSurvey extends Response {
  survey: {
    id: string;
    title: string;
    questions: Array<{
      id: string;
      question: string;
      type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
      options?: string[];
    }>;
  };
}

export interface SurveyStatistics {
  totalResponses: number;
  totalSent: number;
  responseRate: number;
  averageCompletionTime?: number;
  questionStats: QuestionStatistics[];
}

export interface QuestionStatistics {
  questionId: string;
  question: string;
  type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
  responseCount: number;
  choices?: Array<{
    option: string;
    count: number;
    percentage: number;
  }>;
  averageRating?: number;
  textResponses?: string[];
}