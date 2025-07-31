import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/user';
import { generateToken } from '@/lib/auth'; 

export async function POST(req) {
console.log("befordbConnect");
  await connectDB();
  const { email, password } = await req.json();
console.log("after dbConnect");
  const user = await User.findOne({ email });
  console.log(user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await generateToken(user);      


  const response = NextResponse.json({ message: 'Login successful' });
  // response.headers.set(
  //   'Set-Cookie',
  //   serialize('token', token, {
  //     httpOnly: true,
  //     path: '/',
  //     maxAge: 3600, // 1 hour
  //   })
  // );
response.cookies.set('token', token, {httpOnly: true, maxAge: 60*60});

return response;
}
