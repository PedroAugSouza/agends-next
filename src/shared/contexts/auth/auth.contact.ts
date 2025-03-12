export interface AuthContextProps {
  signUp(input: SignupInput): void;
  signIn(input: SigninInput): void;
  signOut(): void;
  serverErrors: ServerErrorsType | null;
  user: User | null;
}

export interface User {
  name: string;
  email: string;
  dateBirth: Date;
  uuid: string;
  token: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  dateBirth: Date;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface ServerErrorsType {
  [index: string]: string;
}
