import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./login/sign-up').then(m => m.SignupComponent),
  },  {
    path: 'chat',
    loadComponent: () => import('./chat/chat').then(m => m.ChatComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'showcase',
    loadComponent: () => import('./showcase/showcase.component').then(m => m.ShowcaseComponent),
  },
  {
    path: 'tailwind-demo',
    loadComponent: () => import('./demo/tailwindui-demo.component').then(m => m.HeadcountUiDemoComponent),
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];