import { renderToStream } from '@react-pdf/renderer';
import { ReportDocument, ReportData } from './report';
import React from 'react';

export async function generatePdfStream(data: ReportData) {
  return await renderToStream(<ReportDocument data={data} />);
}
