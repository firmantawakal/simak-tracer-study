'use client';

import { useState } from 'react';
import { submitSurveyResponse } from '@/app/actions/token.actions';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Question } from '@/types/survey.types';
import { CheckCircle } from 'lucide-react';

interface SurveyFormProps {
  survey: {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
  };
  token: string;
  alumniName: string;
}

export function SurveyForm({ survey, token, alumniName }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    survey.questions.forEach((question) => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = 'Pertanyaan ini wajib diisi';
      }

      if (question.type === 'rating' && answers[question.id]) {
        const rating = parseInt(answers[question.id]);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          newErrors[question.id] = 'Rating harus antara 1-5';
        }
      }

      if (question.type === 'multiple_choice' && answers[question.id]) {
        if (question.options && !question.options.includes(answers[question.id])) {
          newErrors[question.id] = 'Pilihan tidak valid';
        }
      }

      if (question.type === 'checkbox' && answers[question.id]) {
        const selectedOptions = Array.isArray(answers[question.id])
          ? answers[question.id]
          : [answers[question.id]];

        if (question.options && !selectedOptions.every(opt => question.options!.includes(opt))) {
          newErrors[question.id] = 'Pilihan tidak valid';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const result = await submitSurveyResponse(token, formattedAnswers);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'Gagal mengirim survey. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ketik jawaban Anda di sini..."
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(value) ? value.includes(option) : false}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleInputChange(question.id, [...currentValues, option]);
                      } else {
                        handleInputChange(question.id, currentValues.filter(v => v !== option));
                      }
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      case 'rating':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleInputChange(question.id, rating)}
                  className={`w-12 h-12 rounded-full border-2 font-medium transition-colors ${
                    value === rating
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Sangat Buruk</span>
              <span>Sangat Baik</span>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Terima Kasih!
        </h2>
        <p className="text-gray-600 mb-2">
          Survey telah berhasil dikirim.
        </p>
        <p className="text-gray-500 text-sm">
          Partisipasi Anda sangat berharga bagi kemajuan Universitas Dumai.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-gray-600 mb-4">{survey.description}</p>
        )}
        <p className="text-sm text-gray-500">
          Selamat datang, <span className="font-medium">{alumniName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {survey.questions.map(renderQuestion)}

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Survey'}
          </Button>
        </div>
      </form>
    </div>
  );
}