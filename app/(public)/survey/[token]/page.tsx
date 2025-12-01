import { SurveyForm } from '@/components/forms/SurveyForm';
import { validateSurveyToken } from '@/app/actions/token.actions';

interface SurveyPageProps {
  params: {
    token: string;
  };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const token = params.token;

  try {
    const validation = await validateSurveyToken(token);

    if (!validation.valid) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Link Survey Tidak Valid
            </h2>
            <p className="text-gray-600">
              {validation.error || 'Link survey telah kadaluarsa atau tidak valid.'}
            </p>
          </div>
        </div>
      );
    }

    if (!validation.data) {
      throw new Error('Data survey tidak ditemukan');
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <SurveyForm
            survey={validation.data.survey}
            token={token}
            alumniName={validation.data.alumniName}
          />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600">
            Terjadi kesalahan saat memuat survey. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }
}