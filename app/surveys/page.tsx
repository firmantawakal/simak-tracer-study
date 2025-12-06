'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, Clock, Calendar, ExternalLink } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  createdAt: string;
  questionCount: number;
}

interface SurveyResponse {
  surveys: Survey[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  const fetchSurveys = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/surveys?${params}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data survei');
      }

      const data: SurveyResponse = await response.json();
      setSurveys(data.surveys);
      setTotalSurveys(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [currentPage, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSurveys();
  };

  const isDeadlineApproaching = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Show loading state */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Show survey list */}
        {!isLoading && (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Survei Tracer Study
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Berpartisipasilah dalam survei kami untuk membantu meningkatkan kualitas pendidikan dan layanan alumni
              </p>
            </div>

            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <form onSubmit={handleSearchSubmit} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Cari survei berdasarkan judul atau deskripsi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </form>
            </div>

            {/* Surveys List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : surveys.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {search ? 'Tidak Ada Survei Ditemukan' : 'Belum Ada Survei Aktif'}
                </h3>
                <p className="text-gray-600">
                  {search
                    ? 'Coba ubah kata kunci pencarian Anda'
                    : 'Saat ini belum ada survei yang tersedia. Silakan coba lagi nanti.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-gray-500 mb-4">
                  Menampilkan {surveys.length} dari {totalSurveys} survei
                </div>

                {surveys.map((survey) => (
                  <div key={survey.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {survey.title}
                        </h3>
                        {survey.description && (
                          <p className="text-gray-600 mb-4">{survey.description}</p>
                        )}
                      </div>
                      <Link
                        href={`/surveys/${survey.id}`}
                        className="ml-4 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Isi Survei
                      </Link>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Dibuat: {new Date(survey.createdAt).toLocaleDateString('id-ID')}
                        </div>

                        {survey.deadline && (
                          <div className={`flex items-center ${
                            isDeadlineApproaching(survey.deadline) ? 'text-orange-600 font-medium' : ''
                          }`}>
                            <Clock className="h-4 w-4 mr-1" />
                            Batas: {new Date(survey.deadline).toLocaleDateString('id-ID')}
                            {isDeadlineApproaching(survey.deadline) && ' (Deadline Dekat!)'}
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {survey.questionCount} Pertanyaan
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}