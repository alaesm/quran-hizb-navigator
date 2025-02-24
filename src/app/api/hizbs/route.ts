import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const dataDirectory = path.join(process.cwd(), 'source', 'hizb');
  const files = fs.readdirSync(dataDirectory);
  const hizbs = files.map(file => {
    const filePath = path.join(dataDirectory, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });

  const response = NextResponse.json(hizbs);
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return response;
}