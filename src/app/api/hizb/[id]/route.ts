import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
  const { id } = params;
  const dataDirectory = path.join(process.cwd(), 'source', 'hizb');
  const filePath = path.join(dataDirectory, `hizb_${id}.json`);

  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); 

    return response;
  } else {
    return NextResponse.json({ message: 'Hizb not found' });
  }
}