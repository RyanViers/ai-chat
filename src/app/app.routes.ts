import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/chat/chat').then((m) => m.ChatComponent),
  }
];
