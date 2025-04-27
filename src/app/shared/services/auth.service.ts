import { Injectable, signal, inject } from '@angular/core';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { SignUpAttributes } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private cognitoUser = signal(null);
  
  getCognitoUser() {
    return this.cognitoUser();
  }

  setCognitoUser(user: any) {
    this.cognitoUser.set(user);
  }

  constructor() {
    // prime the signal once on app start
    getCurrentUser()
      .then(u => this.cognitoUser.set(u))
      .catch(() => this.cognitoUser.set(null));
  }

  async signIn(username: string, password: string) {
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

  async signUp(signUpData: SignUpAttributes) {
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

  async signOut() {
    try {
      await signOut();
      this.cognitoUser.set(null);
      this.router.navigate(['/auth']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}