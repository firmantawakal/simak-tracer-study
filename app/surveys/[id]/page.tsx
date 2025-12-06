'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircle, ArrowLeft, Send } from 'lucide-react';

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'textarea';
  question: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  questions: Question[];
}

interface FormData {
  answers: Array<{
    questionId: string;
    question: string;
    answer: any;
  }>;
  respondentInfo: {
    name: string;
    email: string;
    graduationYear: number;
    major: string;
  };
}

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    answers: [],
    respondentInfo: {
      name: '',
      email: '',
      graduationYear: new Date().getFullYear(),
      major: ''
    }
  });

  const surveyId = params.id as string;

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setAlert({ type: 'error', message: 'Survei tidak ditemukan atau tidak aktif' });
          return;
        }
        throw new Error('Gagal memuat survei');
      }

      const surveyData: Survey = await response.json();
      setSurvey(surveyData);

      // Initialize answers array
      const answers = surveyData.questions.map((question) => ({
        questionId: question.id,
        question: question.question,
        answer: ''
      }));

      setFormData(prev => ({ ...prev, answers }));
    } catch (error) {
      console.error('Error fetching survey:', error);
      setAlert({ type: 'error', message: 'Gagal memuat survei. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, []);

  const updateAnswer = (questionId: string, answer: any) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(a =>
        a.questionId === questionId ? { ...a, answer } : a
      )
    }));
  };

  const updateRespondentInfo = (field: keyof FormData['respondentInfo'], value: any) => {
    setFormData(prev => ({
      ...prev,
      respondentInfo: {
        ...prev.respondentInfo,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    // Validate respondent info
    if (!formData.respondentInfo.name.trim()) {
      return 'Nama wajib diisi';
    }
    if (!formData.respondentInfo.email.trim()) {
      return 'Email wajib diisi';
    }
    if (!formData.respondentInfo.major.trim()) {
      return 'Jurusan wajib diisi';
    }

    // Validate answers
    for (const question of survey?.questions || []) {
      if (question.required) {
        const answer = formData.answers.find(a => a.questionId === question.id);
        if (!answer || !answer.answer || (typeof answer.answer === 'string' && !answer.answer.trim())) {
          return `Pertanyaan "${question.question}" wajib diisi`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await fetch(`/api/surveys/${surveyId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim jawaban');
      }

      setIsSubmitted(true);
      setAlert({ type: 'success', message: 'Survei berhasil dikirim! Terima kasih atas partisipasi Anda.' });
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      setAlert({ type: 'error', message: error.message || 'Gagal mengirim jawaban. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const answer = formData.answers.find(a => a.questionId === question.id)?.answer || '';

    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={answer}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="Masukkan jawaban Anda..."
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            value={answer}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="Masukkan jawaban Anda..."
            required={question.required}
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  required={question.required}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={answer === rating}
                  onChange={(e) => updateAnswer(question.id, parseInt(e.target.value))}
                  required={question.required}
                  className="sr-only"
                />
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-colors ${
                  answer === rating
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {rating}
                </div>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-green-500 mb-6">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Terima Kasih!
            </h2>
            <p className="text-gray-600 mb-8">
              Jawaban survei Anda telah berhasil dikirim. Partisipasi Anda sangat berharga untuk pengembangan institusi kami.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push('/surveys')}>
                Lihat Survei Lainnya
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Survei Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Survei yang Anda cari tidak ditemukan atau tidak aktif.
            </p>
            <Button onClick={() => router.push('/surveys')}>
              Kembali ke Daftar Survei
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/surveys')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Survei
        </Button>

        {/* Survey Header */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 mb-4">{survey.description}</p>
          )}

          {survey.deadline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Batas Waktu:</strong> {new Date(survey.deadline).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Respondent Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Responden</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <Input
                  type="text"
                  value={formData.respondentInfo.name}
                  onChange={(e) => updateRespondentInfo('name', e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.respondentInfo.email}
                  onChange={(e) => updateRespondentInfo('email', e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Lulus *
                </label>
                <Input
                  type="number"
                  value={formData.respondentInfo.graduationYear}
                  onChange={(e) => updateRespondentInfo('graduationYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan/Program Studi *
                </label>
                <Input
                  type="text"
                  value={formData.respondentInfo.major}
                  onChange={(e) => updateRespondentInfo('major', e.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  required
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pertanyaan</h2>
            <div className="space-y-8">
              {survey.questions.map((question, index) => (
                <div key={question.id}>
                  <div className="flex items-start mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                      {renderQuestionInput(question)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Kirim Jawaban
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}