import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/dal';
import { AdminNav } from '@/components/layouts/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await verifyAdmin();
  } catch (error) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}