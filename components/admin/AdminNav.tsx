'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';

const menuItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/admin/alumni',
    label: 'Data Alumni',
    icon: Users
  },
  {
    href: '/admin/surveys',
    label: 'Survei',
    icon: FileText
  },
  {
    href: '/admin/responses',
    label: 'Respons',
    icon: MessageSquare
  },
  {
    href: '/admin/tokens',
    label: 'Token',
    icon: GraduationCap
  },
  {
    href: '/admin/settings',
    label: 'Pengaturan',
    icon: Settings
  }
];

export function AdminNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-md">
                <span className="font-bold text-lg">UD</span>
              </div>
              <span className="font-semibold text-gray-900">
                Tracer Study Admin
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>
    </nav>
  );
}