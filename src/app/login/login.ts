import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../shared/components/modal';

@Component({
  selector: 'login',
  imports: [RouterLink, ModalComponent],
  template: `
    <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 blur-3xl animate-pulse"></div>
        <div class="absolute w-96 h-96 bg-purple-500/10 rounded-full -bottom-48 -right-48 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <!-- Login card -->
      <div class="relative z-10 w-full max-w-md mx-4">
        <div class="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <h2 class="text-3xl font-bold text-white mb-6 text-center bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome Back
          </h2>

          <!-- Email input -->
          <div class="relative mb-4">
            <input
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              type="email"
              class="w-full p-3 pl-12 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
              placeholder="Email"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <!-- Password input -->
          <div class="relative mb-6">
            <input
              [value]="password()"
              (input)="password.set($any($event.target).value)"
              type="password"
              class="w-full p-3 pl-12 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
              placeholder="Password"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1.9-2 2-2s2 .9 2 2m-6 0c0-1.1.9-2 2-2s2 .9 2 2m-6 4v6h12v-6"/>
            </svg>
          </div>

          <!-- Sign in button -->
          <button
            (click)="login()"
            class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02]"
          >
            Sign In
          </button>

          <!-- Sign up link -->
          <div class="mt-4 text-center">
            <span class="text-sm text-gray-300">Don't have an account? </span>
            <a routerLink="/sign-up" class="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up</a>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <app-modal
        [open]="showModal()"
        [title]="modalTitle()"
        (close)="showModal.set(false)"
      >
        <p class="text-center text-white">{{ modalMessage() }}</p>
      </app-modal>
    </div>
  `,
})
export class LoginComponent {
  protected service = inject(AuthService);

  protected email = signal('');
  protected password = signal('');
  
  protected showModal = signal(false);
  protected modalMessage = signal('');
  protected modalTitle = signal('');

  login = async () => {
    this.showModal.set(false);
    try {
      await this.service.signIn(this.email(), this.password());
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