import { GraduationCap, Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

function StatCard({ title, value, description, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  // This would be fetched from API in real implementation
  const stats = [
    {
      title: "Total Alumni",
      value: "1,234",
      description: "Terdaftar dalam sistem",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Survei Aktif",
      value: "5",
      description: "Sedang berlangsung",
      icon: FileText,
      color: "bg-green-500"
    },
    {
      title: "Respons Rate",
      value: "78%",
      description: "Dari target 100%",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Total Respons",
      value: "892",
      description: "Survei telah diisi",
      icon: MessageSquare,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}