import { Plus, FileText, Users, Download, BarChart } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

function QuickAction({ title, description, icon: Icon, href, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${color}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-white bg-opacity-80">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function QuickActions() {
  const actions = [
    {
      title: "Buat Survei Baru",
      description: "Tambahkan survei tracer study baru",
      icon: Plus,
      href: "/admin/surveys?action=create",
      color: "border-blue-200 bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Tambah Alumni",
      description: "Daftarkan alumni baru ke sistem",
      icon: Users,
      href: "/admin/alumni?action=create",
      color: "border-green-200 bg-green-50 hover:bg-green-100"
    },
    {
      title: "Lihat Laporan",
      description: "Analisis data survei dan alumni",
      icon: BarChart,
      href: "/admin/reports",
      color: "border-purple-200 bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Export Data",
      description: "Unduh data dalam format Excel/CSV",
      icon: Download,
      href: "/admin/export",
      color: "border-orange-200 bg-orange-50 hover:bg-orange-100"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
}