import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { QuickActions } from '@/components/admin/QuickActions';

export default async function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di panel administrasi Tracer Study Universitas Dumai
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* Recent Activity - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ringkasan Sistem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2024</div>
              <div className="text-sm text-gray-600">Tahun Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">Total Survei</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}