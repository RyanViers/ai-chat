import { Injectable, signal, inject } from '@angular/core';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { CognitoUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  protected router = inject(Router);

  user = signal<CognitoUser | null>(null);
  email = signal('');
  password = signal('');

  constructor() {
    // fetch current user if already signed in
    getCurrentUser()
      .then((u) => this.user.set({ username: u.username, attributes: u.signInDetails ?? {} }))
      .catch(() => this.user.set(null));
  }

  async signIn() {
    try {
      await signIn({
        username: this.email(),
        password: this.password()
      });
      // on success, fetch and set user
      const u = await getCurrentUser();
      this.user.set({ username: u.username, attributes: u.signInDetails ?? {} });
      this.router.navigateByUrl('/');
    } catch (e) {
      console.error('Login error', e);
    }
  }

  async signUp() {
    try {
      await signUp({
        username: this.email(),
        password: this.password(),
        options: { userAttributes: { email: this.email() } }
      });
      this.router.navigateByUrl('/login');
    } catch (e) {
      console.error('Sign up error', e);
    }
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

  async signOut() {
    await signOut();
    this.user.set(null);
    this.router.navigateByUrl('/login');
  }
}