// /lib/auth.js
import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET || 'your_strong_secret';
const encoder = new TextEncoder();

function getSecretKey() {
  return encoder.encode(secret);
}

export const generateToken = async (user) => {
  return await new SignJWT({
    id: user._id.toString(),
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getSecretKey());
};

export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload;
};
