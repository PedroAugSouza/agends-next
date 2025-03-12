import { useState } from 'react';
import { AuthContext } from './auth.context';
import {
  ServerErrorsType,
  SigninInput,
  SignupInput,
  User,
} from './auth.contact';
import { useRegisterUserControllerHandle } from '@/shared/http/http';
import { ApiErrors } from '@/shared/constants/api-errors.constants';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [serverErrors, setServerErrors] = useState<ServerErrorsType | null>(
    null,
  );

  const signUp = (input: SignupInput) => {
    const { error } = useRegisterUserControllerHandle({
      axios: {
        data: {
          ...input,
        },
      },
    });

    if (error?.response) {
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
    }
  };

  const signIn = (input: SigninInput) => {};

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, signOut, user, serverErrors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
