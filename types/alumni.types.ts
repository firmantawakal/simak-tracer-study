export interface Alumni {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  major: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlumniWithTokens extends Alumni {
  _count: {
    tokens: number;
  };
}

export interface ImportAlumniData {
  name: string;
  email: string;
  graduationYear: number;
  major: string;
}

export interface AlumniCSVRow {
  name: string;
  email: string;
  graduationYear: string;
  major: string;
}

export interface SurveyToken {
  id: string;
  tokenHash: string;
  surveyId: string;
  alumniId: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  usedAt?: Date;
}

export interface TokenWithSurveyAndAlumni extends SurveyToken {
  survey: {
    id: string;
    title: string;
    isActive: boolean;
  };
  alumni: {
    id: string;
    name: string;
    email: string;
  };
}