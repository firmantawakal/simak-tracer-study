'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, Search, Edit, Trash2, Eye, Send, Copy, Users } from 'lucide-react';
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

export function SurveyManagement({ initialSurveys, totalSurveys }: SurveyManagementProps) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTokensModal, setShowTokensModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to save survey');

      const savedSurvey = await response.json();

      if (editingSurvey) {
        setSurveys(surveys.map(s => s.id === editingSurvey.id ? savedSurvey : s));
        setAlert({ type: 'success', message: 'Survey updated successfully!' });
      } else {
        setSurveys([...surveys, savedSurvey]);
        setAlert({ type: 'success', message: 'Survey created successfully!' });
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
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save survey' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey? This will also delete all related tokens and responses.')) return;

    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete survey');

      setSurveys(surveys.filter(s => s.id !== id));
      setAlert({ type: 'success', message: 'Survey deleted successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete survey' });
    }
  };

  const handleEdit = (survey: Survey) => {
    setEditingSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description || '',
      questions: survey.questions as Question[],
      isActive: survey.isActive,
      deadline: survey.deadline ? new Date(survey.deadline).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const generateTokens = async (surveyId: string) => {
    try {
      const response = await fetch(`/api/admin/surveys/${surveyId}/generate-tokens`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate tokens');

      setAlert({ type: 'success', message: 'Tokens generated successfully!' });
      setSelectedSurvey(null);
      setShowTokensModal(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to generate tokens' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
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
              placeholder="Search surveys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {paginatedSurveys.length} of {filteredSurveys.length} surveys
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
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
                    {survey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  {Array.isArray(survey.questions) ? survey.questions.length : 0}
                </TableCell>
                <TableCell>
                  {survey.deadline ? new Date(survey.deadline).toLocaleDateString() : 'No deadline'}
                </TableCell>
                <TableCell>{new Date(survey.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(survey)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setShowTokensModal(true);
                      }}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(survey.id)}
                      className="text-red-600 hover:text-red-700"
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
        title={editingSurvey ? 'Edit Survey' : 'Create New Survey'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
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
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
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
              <span className="text-sm font-medium text-gray-700">Active Survey</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Questions</h3>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Input
                      type="text"
                      placeholder="Question text"
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      required
                    />

                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="rating">Rating (1-5)</option>
                    </select>
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (one per line)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={question.options?.join('\n') || ''}
                        onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
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
                      <span className="text-sm text-gray-700">Required</span>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
              {editingSurvey ? 'Update Survey' : 'Create Survey'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tokens Modal */}
      <Modal
        isOpen={showTokensModal}
        onClose={() => {
          setShowTokensModal(false);
          setSelectedSurvey(null);
        }}
        title="Generate Survey Tokens"
        size="md"
      >
        {selectedSurvey && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedSurvey.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate survey tokens for all alumni. Each alumni will receive a unique token to access this survey.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Token Information:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tokens will be sent to alumni email addresses</li>
                <li>• Each token expires after 7 days</li>
                <li>• Tokens can only be used once</li>
                <li>• Existing tokens for this survey will be deactivated</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTokensModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => generateTokens(selectedSurvey.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Generate & Send Tokens
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}