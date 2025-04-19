import { Component, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ModalComponent } from '../shared/modal';

@Component({
  selector: 'sign-up',
  imports: [ModalComponent],
  template: `
    <div class="flex items-center justify-center h-screen bg-slate-900">
      <div class="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4 text-white">Sign Up</h2>
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
          (click)="service.signUp()"
          class="w-full bg-green-600 py-2 rounded text-white mb-2"
        >
          Create Account
        </button>
        <button
          (click)="service.goBack()"
          class="w-full bg-red-600 py-2 rounded text-white"
        >
          Cancel
        </button>
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
export class SignupComponent {
  protected service = inject(AuthService);

  protected showModal = signal(false);
  protected modalMessage = signal('');
  protected modalTitle = signal('');

  signup = async () => {
    this.showModal.set(false);
    try {
      await this.service.signUp();
      this.modalTitle.set('Success');
      this.modalMessage.set('Registered successfully.');
      this.showModal.set(true);
    } catch (e: any) {
      this.modalTitle.set('Error');
      this.modalMessage.set(e.message || 'Sign up failed.');
      this.showModal.set(true);
    }
  };
}