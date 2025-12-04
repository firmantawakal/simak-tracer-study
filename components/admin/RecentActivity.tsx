import { MessageSquare, FileText, Users, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'response' | 'survey' | 'alumni';
  title: string;
  description: string;
  timestamp: string;
}

const activityIcons = {
  response: MessageSquare,
  survey: FileText,
  alumni: Users
};

const activityColors = {
  response: 'text-blue-600 bg-blue-100',
  survey: 'text-green-600 bg-green-100',
  alumni: 'text-purple-600 bg-purple-100'
};

export function RecentActivity() {
  // This would be fetched from API in real implementation
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'response',
      title: 'Respons Survei Baru',
      description: 'John Doe telah menyelesaikan survei karir 2024',
      timestamp: '5 menit yang lalu'
    },
    {
      id: '2',
      type: 'alumni',
      title: 'Alumni Baru Terdaftar',
      description: 'Jane Smith mendaftar sebagai alumni baru',
      timestamp: '1 jam yang lalu'
    },
    {
      id: '3',
      type: 'survey',
      title: 'Survei Dibuat',
      description: 'Survei "Kepuasan Alumni" telah dibuat dan dipublikasikan',
      timestamp: '3 jam yang lalu'
    },
    {
      id: '4',
      type: 'response',
      title: 'Respons Survei Baru',
      description: 'Bob Johnson telah menyelesaikan survei karir 2024',
      timestamp: '4 jam yang lalu'
    },
    {
      id: '5',
      type: 'survey',
      title: 'Survei Selesai',
      description: 'Survei "Tracer Study 2023" telah ditutup',
      timestamp: '1 hari yang lalu'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terkini</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Lihat semua aktivitas →
          </button>
        </div>
      </div>
    </div>
  );
}