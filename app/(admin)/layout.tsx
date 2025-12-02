import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/dal';
import { AdminNav } from '@/components/layouts/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the current page is the login page
  // We'll check this in a client component or by using a different approach
  try {
    await verifyAdmin();

    // If authenticated, show full admin layout
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    );
  } catch (error) {
    // If not authenticated, redirect to login
    redirect('/login');
  }
}