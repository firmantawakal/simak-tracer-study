'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, Eye, Download, BarChart, Filter, Calendar } from 'lucide-react';
import { Response, Survey } from '@prisma/client';

interface ResponseWithDetails {
  id: string;
  surveyId: string;
  tokenHash: string;
  answers: any;
  submittedAt: Date;
  survey: Survey;
  alumni: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ResponseManagementProps {
  initialResponses: ResponseWithDetails[];
  totalResponses: number;
  surveys: Survey[];
}

export function ResponseManagement({
  initialResponses,
  totalResponses,
  surveys
}: ResponseManagementProps) {
  const [responses, setResponses] = useState<ResponseWithDetails[]>(initialResponses);
  const [search, setSearch] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<ResponseWithDetails | null>(null);
  const [selectedSurveyForStats, setSelectedSurveyForStats] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalResponses / itemsPerPage);

  const filteredResponses = responses.filter(response => {
    const matchesSearch = search === '' ||
      response.survey.title.toLowerCase().includes(search.toLowerCase()) ||
      (response.alumni?.name.toLowerCase().includes(search.toLowerCase())) ||
      (response.alumni?.email.toLowerCase().includes(search.toLowerCase()));

    const matchesSurvey = selectedSurvey === '' || response.surveyId === selectedSurvey;

    return matchesSearch && matchesSurvey;
  });

  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewResponse = (response: ResponseWithDetails) => {
    setSelectedResponse(response);
    setShowModal(true);
  };

  const handleViewStats = async (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedSurveyForStats(survey);
      setShowStatsModal(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['Survey', 'Alumni Name', 'Alumni Email', 'Submitted At', 'Answers'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => [
        response.survey.title,
        response.alumni?.name || 'Unknown',
        response.alumni?.email || 'Unknown',
        new Date(response.submittedAt).toLocaleDateString(),
        JSON.stringify(response.answers).replace(/"/g, '""')
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAnswerDisplay = (question: any, answer: any) => {
    if (question.type === 'multiple_choice') {
      return Array.isArray(answer) ? answer.join(', ') : answer;
    } else if (question.type === 'rating') {
      return `${answer}/5`;
    }
    return answer;
  };

  const getSurveyStats = (survey: Survey) => {
    const surveyResponses = responses.filter(r => r.surveyId === survey.id);
    const questions = survey.questions as any[];

    const stats = questions.map(question => {
      const answers = surveyResponses
        .map(r => {
          const answerObj = (r.answers as any[]).find((a: any) => a.question === question.question);
          return answerObj?.answer;
        })
        .filter(Boolean);

      const stats: any = {
        question: question.question,
        total: answers.length,
        type: question.type
      };

      if (question.type === 'multiple_choice') {
        const optionCounts: Record<string, number> = {};
        answers.forEach(answer => {
          const key = Array.isArray(answer) ? answer.join(', ') : answer;
          optionCounts[key] = (optionCounts[key] || 0) + 1;
        });
        stats.options = optionCounts;
      } else if (question.type === 'rating') {
        const ratings = answers.map(a => Number(a)).filter(n => !isNaN(n));
        stats.average = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '0';
        stats.distribution = [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: ratings.filter(r => r === rating).length
        }));
      }

      return stats;
    });

    return stats;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Survey Responses</h1>
        <div className="flex space-x-3">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search responses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Surveys</option>
                {surveys.map(survey => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Showing {paginatedResponses.length} of {filteredResponses.length} responses
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Survey</TableHead>
              <TableHead>Alumni</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Answers Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResponses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="font-medium">{response.survey.title}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{response.alumni?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{response.alumni?.email || 'Unknown'}</div>
                  </div>
                </TableCell>
                <TableCell>{new Date(response.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {Array.isArray(response.answers) ? response.answers.length : 0}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewResponse(response)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewStats(response.surveyId)}
                    >
                      <BarChart className="h-4 w-4" />
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

      {/* Response Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedResponse(null);
        }}
        title="Response Details"
        size="lg"
      >
        {selectedResponse && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-500">Survey</div>
                <div className="font-medium">{selectedResponse.survey.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Submitted At</div>
                <div className="font-medium">
                  {new Date(selectedResponse.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Alumni</div>
                <div className="font-medium">
                  {selectedResponse.alumni?.name || 'Unknown'}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedResponse.alumni?.email || 'Unknown'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Answers</h3>
              <div className="space-y-4">
                {Array.isArray(selectedResponse.answers) &&
                  selectedResponse.answers.map((answerObj: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="font-medium text-gray-900">
                        {answerObj.question}
                      </div>
                      <div className="text-gray-700 mt-1">
                        {answerObj.answer}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Statistics Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setSelectedSurveyForStats(null);
        }}
        title={`${selectedSurveyForStats?.title} - Statistics`}
        size="xl"
      >
        {selectedSurveyForStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {responses.filter(r => r.surveyId === selectedSurveyForStats.id).length}
                </div>
                <div className="text-sm text-blue-800">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getSurveyStats(selectedSurveyForStats).length}
                </div>
                <div className="text-sm text-blue-800">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((responses.filter(r => r.surveyId === selectedSurveyForStats.id).length /
                     (responses.length || 1)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-800">Response Rate</div>
              </div>
            </div>

            <div className="space-y-6">
              {getSurveyStats(selectedSurveyForStats).map((stat: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{stat.question}</h4>

                  <div className="text-sm text-gray-500 mb-2">
                    {stat.total} responses ({((stat.total / responses.filter(r => r.surveyId === selectedSurveyForStats.id).length) * 100).toFixed(1)}%)
                  </div>

                  {stat.type === 'multiple_choice' && stat.options && (
                    <div className="space-y-2">
                      {Object.entries(stat.options).map(([option, count]) => {
                        const percentage = (Number(count) / stat.total) * 100;
                        return (
                          <div key={option} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-700">{option}</span>
                                <span className="text-sm text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {stat.type === 'rating' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {stat.average}/5
                        </div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>

                      {stat.distribution && (
                        <div className="space-y-2">
                          {stat.distribution.map(({ rating, count }: any) => {
                            const percentage = (count / stat.total) * 100;
                            return (
                              <div key={rating} className="flex items-center space-x-3">
                                <div className="w-8 text-sm font-medium text-gray-700">{rating}★</div>
                                <div className="flex-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-yellow-400 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="w-12 text-right text-sm text-gray-500">
                                  {count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {stat.type === 'text' && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">
                        Text responses require individual review
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}