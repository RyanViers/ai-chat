// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = async (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const isAuth = await auth.isAuthenticated();

  // If user is NOT authenticated and trying to enter /chat (or any protected route)
  if (!isAuth && state.url !== '/login') {
    router.navigate(['/login']);
    return false;
  }

  // If user IS authenticated but landed on /login or /signup, kick them to /chat
  if (isAuth && (state.url === '/login' || state.url === '/signup')) {
    router.navigate(['/chat']);
    return false;
  }

  // Otherwise, allow the navigation to continue
  return true;
};
