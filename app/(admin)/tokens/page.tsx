import { TokenManagement } from '@/components/admin/TokenManagement';
import { prisma } from '@/lib/prisma';

export default async function TokensPage() {
  const tokens = await prisma.surveyToken.findMany({
    include: {
      survey: {
        select: {
          id: true,
          title: true,
        }
      },
      alumni: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const totalTokens = await prisma.surveyToken.count();

  const surveys = await prisma.survey.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <TokenManagement
      initialTokens={tokens}
      totalTokens={totalTokens}
      surveys={surveys}
    />
  );
}