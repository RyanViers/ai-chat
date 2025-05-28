import { Injectable, signal, inject } from '@angular/core';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  confirmSignUp
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { SignUpAttributes } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private cognitoUser = signal(null);

  public getCognitoUser() {
    return this.cognitoUser();
  }

  public async signIn(username: string, password: string) {
    try {
      const user = await signIn({username, password});
      this.cognitoUser.set(user);
      this.router.navigate(['/chat']);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  public async signUp(signUpData: SignUpAttributes) {
    try {
      const user = await signUp({
        username: signUpData.email,
        password: signUpData.password,
      });
      this.cognitoUser.set(user);
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  public async signOut() {
    try {
      await signOut();
      this.cognitoUser.set(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      this.cognitoUser.set(user);
      return true;
    } catch (error) {
      this.cognitoUser.set(null);
      return false;
    }
  }

  public async confirmSignUp(username: string, code: string) {
    try {
      await confirmSignUp({
        username,
        confirmationCode: code
      });
      return true;
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  }
}