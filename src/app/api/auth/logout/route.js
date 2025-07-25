import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    })
  );

  return response;
}
