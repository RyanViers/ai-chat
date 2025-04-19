import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  protected auth = inject(AuthService);
  protected router = inject(Router);

  canActivate(): boolean {
    if (this.auth.user()) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}