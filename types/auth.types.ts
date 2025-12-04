export interface Admin {
  id: string;
  username: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenValidation {
  valid: boolean;
  data?: {
    survey: {
      id: string;
      title: string;
      questions: Array<{
        id: string;
        type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
        question: string;
        required: boolean;
        options?: string[];
      }>;
    };
    alumniName: string;
  };
  error?: string;
}

export interface TokenData {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}