import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: 'admin' }); // Set role as needed

  return NextResponse.json({ message: 'User registered' });
}
