import { SurveyManagement } from '@/components/admin/SurveyManagement';
import { prisma } from '@/lib/prisma';

export default async function SurveysPage() {
  const surveys = await prisma.survey.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const totalSurveys = await prisma.survey.count();

  return <SurveyManagement initialSurveys={surveys} totalSurveys={totalSurveys} />;
}