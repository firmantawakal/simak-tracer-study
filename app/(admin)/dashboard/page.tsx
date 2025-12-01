import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [
    totalAlumni,
    totalSurveys,
    totalResponses,
    activeSurveys,
    recentResponses
  ] = await Promise.all([
    prisma.alumni.count(),
    prisma.survey.count(),
    prisma.response.count(),
    prisma.survey.count({ where: { isActive: true } }),
    prisma.response.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        survey: {
          select: { title: true }
        }
      }
    })
  ]);

  const responseRate = totalSurveys > 0
    ? ((totalResponses / (totalSurveys * totalAlumni)) * 100).toFixed(1)
    : '0';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Alumni</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalAlumni}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Survey</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalSurveys}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Respon</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalResponses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tingkat Respon</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{responseRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Survey Aktif
          </h2>
          <p className="text-3xl font-bold text-blue-600">{activeSurveys}</p>
          <p className="text-sm text-gray-500 mt-1">
            dari {totalSurveys} survey total
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Respon Terbaru
          </h2>
          <div className="space-y-3">
            {recentResponses.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada respons</p>
            ) : (
              recentResponses.map((response) => (
                <div key={response.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    {response.survey.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(response.submittedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}