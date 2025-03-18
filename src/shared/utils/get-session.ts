import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { User } from '../contexts/auth/auth.contact';

export const getSession = () => {
  const userDecoded =
    (jwtDecode(getCookie('token')?.toString() || '') as User) || null;

  return {
    ...userDecoded,
    token: getCookie('token'),
  };
};
