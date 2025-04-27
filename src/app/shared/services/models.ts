export interface CognitoUser {
  username: string;
  attributes: Record<string, any>;
}

export interface SignUpAttributes {
  email: string;
  password: string;
}