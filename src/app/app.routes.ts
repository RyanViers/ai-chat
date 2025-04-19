import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login').then(m => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/sign-up').then(m => m.SignupComponent),
  },
  {
    path: '',
    loadComponent: () => import('./chat/chat').then(m => m.ChatComponent),
    canActivate: [AuthGuard],
  }
];
