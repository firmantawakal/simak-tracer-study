'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, Search, Edit, Trash2, Eye, Send, Copy } from 'lucide-react';
import { Survey } from '@prisma/client';

interface SurveyManagementProps {
  initialSurveys: Survey[];
  totalSurveys: number;
}

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'textarea';
  question: string;
  required: boolean;
  options?: string[];
}

// Utility function to safely parse questions from database
const parseQuestionsFromDB = (questionsData: any): Question[] => {
  if (!questionsData) return [];

  try {
    const parsed = typeof questionsData === 'string'
      ? JSON.parse(questionsData)
      : questionsData;

    if (Array.isArray(parsed)) {
      return parsed.map((q: any, index: number) => ({
        id: q.id || `question-${index}`,
        type: q.type || 'text',
        question: q.question || '',
        required: Boolean(q.required),
        options: Array.isArray(q.options) ? q.options : []
      }));
    }
  } catch (error) {
    console.error('Error parsing questions:', error);
  }

  return [];
};

export function SurveyManagement({ initialSurveys, totalSurveys }: SurveyManagementProps) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedSurveyId, setCopiedSurveyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [] as Question[],
    isActive: true,
    deadline: '',
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalSurveys / itemsPerPage);

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(search.toLowerCase()) ||
    (survey.description && survey.description.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedSurveys = filteredSurveys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false,
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingSurvey
        ? `/api/admin/surveys/${editingSurvey.id}`
        : '/api/admin/surveys';

      const method = editingSurvey ? 'PUT' : 'POST';

      // Validate form data before sending
      if (!formData.title.trim()) {
        throw new Error('Judul survei wajib diisi');
      }

      const validQuestions = formData.questions.filter(q => q.question.trim() !== '');
      if (validQuestions.length === 0) {
        throw new Error('Survei harus memiliki setidaknya satu pertanyaan');
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        questions: validQuestions,
        isActive: formData.isActive,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan survei');
      }

      const savedSurvey = await response.json();

      if (editingSurvey) {
        setSurveys(surveys.map(s => s.id === editingSurvey.id ? savedSurvey : s));
        setAlert({ type: 'success', message: 'Survei berhasil diperbarui!' });
      } else {
        setSurveys([...surveys, savedSurvey]);
        setAlert({ type: 'success', message: 'Survei berhasil dibuat!' });
      }

      setShowModal(false);
      setEditingSurvey(null);
      setFormData({
        title: '',
        description: '',
        questions: [],
        isActive: true,
        deadline: '',
      });
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Gagal menyimpan survei' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus survei ini? Ini juga akan menghapus semua respons terkait.')) return;

    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghapus survei');
      }

      const result = await response.json();
      setAlert({ type: 'success', message: result.message || 'Survei berhasil dihapus!' });
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Gagal menghapus survei' });
    }
  };

  const handleEdit = (survey: Survey) => {
    setEditingSurvey(survey);

    const parsedQuestions = parseQuestionsFromDB(survey.questions);

    const formData = {
      title: survey.title || '',
      description: survey.description || '',
      questions: parsedQuestions,
      isActive: survey.isActive ?? true,
      deadline: survey.deadline ? new Date(survey.deadline).toISOString().split('T')[0] : '',
    };

    setFormData(formData);
    setShowModal(true);
  };

  
  const copySurveyUrl = async (surveyId: string, surveyTitle: string) => {
    try {
      const surveyUrl = `${window.location.origin}/surveys/${surveyId}`;

      await navigator.clipboard.writeText(surveyUrl);

      setCopiedSurveyId(surveyId);
      setAlert({
        type: 'success',
        message: `URL survei "${surveyTitle}" berhasil disalin!`
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedSurveyId(null);
      }, 2000);

    } catch (error: any) {
      // Fallback for browsers that don't support clipboard API
      try {
        const surveyUrl = `${window.location.origin}/surveys/${surveyId}`;
        const textArea = document.createElement('textarea');
        textArea.value = surveyUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopiedSurveyId(surveyId);
          setAlert({
            type: 'success',
            message: `URL survei "${surveyTitle}" berhasil disalin!`
          });

          setTimeout(() => {
            setCopiedSurveyId(null);
          }, 2000);
        } else {
          throw new Error('Copy command failed');
        }
      } catch (fallbackError) {
        setAlert({
          type: 'error',
          message: 'Gagal menyalin URL. Silakan salin secara manual: ' + surveyUrl
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Survei</h1>
        <Button onClick={() => {
          setEditingSurvey(null);
          setFormData({
            title: '',
            description: '',
            questions: [{
              id: Date.now().toString(),
              type: 'text',
              question: '',
              required: false,
              options: []
            }],
            isActive: true,
            deadline: '',
          });
          setShowModal(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Survei
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari survei..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            Menampilkan {paginatedSurveys.length} dari {filteredSurveys.length} survei
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pertanyaan</TableHead>
              <TableHead>Batas Waktu</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSurveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>{survey.description || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    survey.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </TableCell>
                <TableCell>
                  {parseQuestionsFromDB(survey.questions).length}
                </TableCell>
                <TableCell>
                  {survey.deadline ? new Date(survey.deadline).toLocaleDateString() : 'Tidak ada batas waktu'}
                </TableCell>
                <TableCell>{new Date(survey.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(survey)}
                      title="Edit Survei"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copySurveyUrl(survey.id, survey.title)}
                      title={copiedSurveyId === survey.id ? "URL Tersalin!" : "Salin URL Survei"}
                      className={copiedSurveyId === survey.id ? "bg-green-50 border-green-300 text-green-700" : ""}
                    >
                      {copiedSurveyId === survey.id ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(survey.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Hapus Survei"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Survey Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSurvey(null);
          setFormData({
            title: '',
            description: '',
            questions: [],
            isActive: true,
            deadline: '',
          });
        }}
        title={editingSurvey ? 'Edit Survei' : 'Buat Survei Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {editingSurvey && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Anda sedang mengedit survei: <strong>{editingSurvey.title}</strong>
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul
              </label>
              <Input
                type="text"
                required
                placeholder={editingSurvey ? "Masukkan judul survei" : "Contoh: Survei Kepuasan Alumni"}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batas Waktu
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={editingSurvey ? "Masukkan deskripsi survei" : "Jelaskan tujuan survei ini..."}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Survei Aktif</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Pertanyaan</h3>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pertanyaan
              </Button>
            </div>
            {!editingSurvey && formData.questions.length === 1 && !formData.questions[0].question && (
              <p className="text-sm text-gray-500 mb-4">
                Mulai dengan menambahkan pertanyaan pertama untuk survei Anda.
              </p>
            )}

            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Input
                      type="text"
                      placeholder="Teks pertanyaan"
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      required
                    />

                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Teks Pendek</option>
                      <option value="textarea">Teks Panjang</option>
                      <option value="multiple_choice">Pilihan Ganda</option>
                      <option value="rating">Rating (1-5)</option>
                    </select>
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilihan (satu per baris)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={question.options?.join('\n') || ''}
                        onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Pilihan 1&#10;Pilihan 2&#10;Pilihan 3"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Wajib Diisi</span>
                    </label>

                    <Button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
              {editingSurvey ? 'Perbarui Survei' : 'Buat Survei'}
            </Button>
          </div>
        </form>
      </Modal>

          </div>
  );
}