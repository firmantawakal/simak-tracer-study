'use client';

import { Button } from '@/components/ui/Button';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';

interface SurveyFinishMessageProps {
  surveyTitle?: string;
  completedAt?: string;
}

export function SurveyFinishMessage({ surveyTitle, completedAt }: SurveyFinishMessageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          {/* Success Icon */}
          <div className="text-green-500 mb-6">
            <CheckCircle className="h-20 w-20 mx-auto" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terima Kasih! 🎉
          </h1>

          <p className="text-xl text-gray-700 mb-6">
            Anda telah berhasil menyelesaikan survei tracer study
          </p>

          {/* Survey Details */}
          {surveyTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Survei yang telah diisi:
              </h3>
              <p className="text-blue-800 font-medium">{surveyTitle}</p>
              {completedAt && (
                <p className="text-blue-600 text-sm mt-2">
                  Selesai pada: {new Date(completedAt).toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}

          {/* Information Message */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Informasi Penting:
            </h3>
            <div className="text-left text-gray-700 space-y-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p>Jawaban Anda telah tersimpan dengan aman dalam sistem kami</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p>Partisipasi Anda sangat berharga untuk pengembangan institusi</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p>Setiap alumni hanya dapat mengisi satu survei tracer study</p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-2">
              Kontribusi Anda membantu Universitas Dumai untuk:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Meningkatkan Kualitas</h4>
                <p className="text-sm text-blue-700">Evaluasi dan perbaikan kurikulum</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Pengembangan Karir</h4>
                <p className="text-sm text-green-700">Program pendukung alumni</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Jaringan Alumni</h4>
                <p className="text-sm text-purple-700">Membangun komunitas yang kuat</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Butuh Bantuan?
            </h3>
            <p className="text-yellow-800">
              Jika Anda memiliki pertanyaan atau mengalami masalah, silakan hubungi:
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-yellow-700">
                📧 Email: alumni@universitas-dumai.ac.id
              </p>
              <p className="text-sm text-yellow-700">
                📞 Telepon: (0765) 12345
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="min-w-[150px]"
            >
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="min-w-[150px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Muat Ulang Halaman
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}