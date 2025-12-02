import { ResponseManagement } from '@/components/admin/ResponseManagement';
import { prisma } from '@/lib/prisma';

export default async function ResponsesPage() {
  const responses = await prisma.response.findMany({
    include: {
      survey: {
        select: {
          id: true,
          title: true,
          questions: true
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  // Manually get alumni information using tokenHash
  const responsesWithAlumni = await Promise.all(
    responses.map(async (response) => {
      const token = await prisma.surveyToken.findUnique({
        where: {
          tokenHash: response.tokenHash
        },
        include: {
          alumni: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      return {
        ...response,
        alumni: token?.alumni || null
      };
    })
  );

  // Debug log
  console.log('responsesWithAlumni[0]:', JSON.stringify(responsesWithAlumni[0], null, 2));

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
      initialResponses={responsesWithAlumni}
      totalResponses={totalResponses}
      surveys={surveys}
    />
  );
}