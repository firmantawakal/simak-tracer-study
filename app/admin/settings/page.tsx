import { AdminSettings } from '@/components/admin/AdminSettings';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const admin = await verifyAdmin();

  const currentAdmin = await prisma.admin.findUnique({
    where: { id: admin.id },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!currentAdmin) {
    throw new Error('Admin not found');
  }

  return <AdminSettings currentAdmin={currentAdmin} />;
}