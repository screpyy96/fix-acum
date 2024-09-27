import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(token) {
  try {
    return verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

export async function getSession(req) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return { user: decoded };
}

export async function getCurrentUser(req) {
  const session = await getSession(req);
  return session?.user;
}