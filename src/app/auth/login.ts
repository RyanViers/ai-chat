import { Component, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../shared/modal';

@Component({
  selector: 'login',
  imports: [RouterLink, ModalComponent],
  template: `
    <div class="flex items-center justify-center h-screen bg-slate-900">
      <div class="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4 text-white">Login</h2>
        <input
          [value]="service.email()"
          (input)="service.email.set($any($event.target).value)"
          type="email"
          class="w-full mb-3 p-2 rounded bg-slate-700 text-white"
          placeholder="Email"
        />
        <input
          [value]="service.password()"
          (input)="service.password.set($any($event.target).value)"
          type="password"
          class="w-full mb-3 p-2 rounded bg-slate-700 text-white"
          placeholder="Password"
        />
        <button
          (click)="service.signIn()"
          class="w-full bg-blue-600 py-2 rounded text-white mb-2"
        >
          Sign In
        </button>
        <div class="text-center text-sm text-gray-400">
          Don't have an account?
          <a routerLink="/sign-up" class="text-blue-400 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
    <app-modal
      [open]="showModal()"
      [title]="modalTitle()"
      (close)="showModal.set(false)"
    >
      <p class="text-center">{{ modalMessage() }}</p>
    </app-modal>
  `,
})
export class LoginComponent {
  protected service = inject(AuthService);
  
  protected showModal = signal(false);
  protected modalMessage = signal('');
  protected modalTitle = signal('');

  login = async () => {
    this.showModal.set(false);
    try {
      await this.service.signIn();
      this.modalTitle.set('Success');
      this.modalMessage.set('Signed in successfully.');
      this.showModal.set(true);
    } catch (e: any) {
      this.modalTitle.set('Error');
      this.modalMessage.set(e.message || 'Sign in failed.');
      this.showModal.set(true);
    }
  };
}