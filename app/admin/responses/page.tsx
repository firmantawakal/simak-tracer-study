import { ResponseManagement } from '@/components/admin/ResponseManagement';
import { prisma } from '@/lib/prisma';

export default async function ResponsesPage() {
  const responses = await prisma.response.findMany({
    include: {
      survey: {
        select: {
          id: true,
          title: true,
          questions: true,
          description: true,
          deadline: true,
          createdAt: true,
          isActive: true
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  const totalResponses = await prisma.response.count();

  const surveys = await prisma.survey.findMany({
    select: {
      id: true,
      title: true,
      questions: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      isActive: true,
      deadline: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <ResponseManagement
      initialResponses={responses}
      totalResponses={totalResponses}
      surveys={surveys}
    />
  );
}