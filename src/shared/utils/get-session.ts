import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { User } from '../contexts/auth/auth.contact';

export const getSession = () => {
  const rawToken = getCookie('token')?.toString() || null;

  if (!rawToken) {
    return {
      token: null,
    } as Partial<User> & { token: string | null };
  }

  try {
    const userDecoded = (jwtDecode(rawToken) as User) || null;

    return {
      ...userDecoded,
      token: rawToken,
    };
  } catch {
    return {
      token: rawToken,
    } as Partial<User> & { token: string | null };
  }

};
