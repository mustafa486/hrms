import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/dbconnect';
import User from '@/models/User';
import { generateToken } from '@/lib/auth'; 

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await generateToken(user);      


  const response = NextResponse.json({ message: 'Login successful' });
  response.headers.set(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1 hour
    })
  );

  return response;
}
