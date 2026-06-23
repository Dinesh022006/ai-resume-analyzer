import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { calculateATSScore } from '@/lib/ats';
import { generatePdfStream } from '@/lib/pdf/generator';
import { format } from 'date-fns';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: { resume: true },
    });

    if (!analysis) {
      return new NextResponse('Not found', { status: 404 });
    }

    if (analysis.resume.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Reconstruct deterministic ATS Breakdown
    const atsResult = calculateATSScore(analysis.resume.parsedText);

    // Ensure types from DB Json
    const safeArray = (val: unknown): string[] => {
      if (Array.isArray(val)) {
        return val.filter(item => typeof item === 'string');
      }
      return [];
    };

    const reportData = {
      resumeName: analysis.resume.title || analysis.resume.fileName,
      analysisDate: format(analysis.createdAt, 'MMMM do, yyyy'),
      atsScore: analysis.atsScore,
      overallRating: analysis.overallRating,
      summary: analysis.summary,
      strengths: safeArray(analysis.strengths),
      weaknesses: safeArray(analysis.weaknesses),
      missingTechnicalSkills: safeArray(analysis.missingTechnicalSkills),
      missingSoftSkills: safeArray(analysis.missingSoftSkills),
      grammarIssues: safeArray(analysis.grammarIssues),
      formattingSuggestions: safeArray(analysis.formattingSuggestions),
      improvementSuggestions: safeArray(analysis.improvementSuggestions),
      recommendedJobRoles: safeArray(analysis.recommendedJobRoles),
      jobMatchScore: analysis.jobMatchScore,
      jobDescription: analysis.jobDescription,
      atsBreakdown: atsResult.breakdown,
      missingKeywords: atsResult.missingKeywords,
    };

    // Generate PDF Stream
    const stream = await generatePdfStream(reportData);

    // Convert NodeJS Readable to Buffer to ensure Next.js App Router compatibility
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    const safeFilename = `Resume_Analysis_${format(new Date(), 'yyyy-MM-dd')}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Internal Server Error generating PDF', { status: 500 });
  }
}
