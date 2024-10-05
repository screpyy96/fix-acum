import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(token) {
  try {
    const decoded = verify(token, SECRET_KEY);
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Remove or restrict client-side usage of verifyToken
// Only export functions meant for server-side
export async function getSession(req) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;

  const userData = verifyToken(token);
  if (!userData) return null;

  return { user: userData };
}

export async function getCurrentUser(req) {
  console.log('Getting current user...');
  let token = req.cookies.get('auth_token')?.value;
  
  // Verifică și header-ul de autorizare dacă cookie-ul nu există
  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  console.log('Auth token:', token ? 'Present' : 'Missing');
  if (!token) {
    console.log('No auth token found');
    return null;
  }

  const userData = verifyToken(token);
  console.log('User data from token:', userData);
  return userData;
}