import { AlumniManagement } from '@/components/admin/AlumniManagement';
import { prisma } from '@/lib/prisma';

export default async function AlumniPage() {
  const alumni = await prisma.alumni.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const totalAlumni = await prisma.alumni.count();

  return <AlumniManagement initialAlumni={alumni} totalAlumni={totalAlumni} />;
}