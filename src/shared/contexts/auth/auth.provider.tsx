'use client';
import { useState } from 'react';
import { AuthContext } from './auth.context';
import {
  ServerErrorsType,
  SigninInput,
  SignupInput,
  User,
} from './auth.contact';
import {
  authenticateUserControllerHandle,
  registerUserControllerHandle,
} from '@/shared/http/http';
import { ApiErrors } from '@/shared/constants/api-errors.constants';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [serverErrors, setServerErrors] = useState<ServerErrorsType | null>(
    null,
  );

  const { push } = useRouter();

  const signUp = (input: SignupInput) => {
    registerUserControllerHandle({
      dateBirth: input.dateBirth.toISOString(),
      email: input.email,
      name: input.name,
      password: input.password,
    })
      .catch((error) => {
        if (error.response.data.reason === ApiErrors.USER_ALREADY_EXISTS) {
          setServerErrors({
            email: 'Email já cadastrado.',
          });
        }
        if (error.response.data.reason === ApiErrors.PARAM_INVALID_ERROR) {
          setServerErrors({
            dateBirth: 'Data inválida.',
          });
        }
      })
      .then(() => {
        push('/login');
      });
  };

  const signIn = (input: SigninInput) => {
    authenticateUserControllerHandle({
      email: input.email,
      password: input.password,
    })
      .catch((error) => {
        if (error.response.data.reason === ApiErrors.USER_NOT_FOUND) {
          setServerErrors({
            email: 'Email não cadastrado.',
          });
        }
        if (error.response.data.reason === ApiErrors.UNAUTHORIZED) {
          setServerErrors({
            password: 'Senha inválida.',
          });
        }

        return;
      })
      .then((response) => {
        if (!response) return;

        const userDecoded =
          (jwtDecode(response!.data.access_token ?? '') as User) || null;

        setCookie('token', response?.data.access_token ?? '');

        setUser({ ...userDecoded, token: response?.data.access_token! });

        push('/');
      });
  };

  const signOut = () => {
    setUser(null);

    push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, signOut, user, serverErrors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
