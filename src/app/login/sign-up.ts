import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { ModalComponent } from '../shared/components/modal';
import { SignUpAttributes } from '../shared/services/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sign-up',
  imports: [ModalComponent, ReactiveFormsModule, RouterLink],
  template: `
    <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 blur-3xl animate-pulse"></div>
        <div class="absolute w-96 h-96 bg-purple-500/10 rounded-full -bottom-48 -right-48 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <!-- Sign-up card -->
      <div class="relative z-10 w-full max-w-md mx-4">
        <div class="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <h2 class="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Create Your Account
          </h2>

          <!-- Email input -->
          <div class="relative mb-4">
            <input
              [formControl]="emailControl"
              type="email"
              class="w-full p-3 pl-12 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
              placeholder="Email"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <!-- Password input -->
          <div class="relative mb-4">
            <input
              [formControl]="passwordControl"
              type="password"
              class="w-full p-3 pl-12 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 peer"
              placeholder="Password"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1.9-2 2-2s2 .9 2 2m-6 0c0-1.1.9-2 2-2s2 .9 2 2m-6 4v6h12v-6"/>
            </svg>
          </div>

          <!-- Create Account button -->
          <button
            (click)="signup()"
            class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] mb-3"
          >
            Create Account
          </button>

          <!-- Cancel button -->
          <button
            routerLink="/login"
            class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02]"
          >
            Cancel
          </button>
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
export class SignupComponent {
  protected service = inject(AuthService);
  
  // Create form controls for all SignUpAttributes
  protected emailControl = new FormControl('', [Validators.email, Validators.required]);
  protected passwordControl = new FormControl('', [Validators.required]);

  


  // Modal signals
  protected showModal = signal(false);
  protected modalMessage = signal('');
  protected modalTitle = signal('');
  
  protected signup = async () => {
    this.showModal.set(false);
    try {
      // Prepare signup data matching SignUpAttributes
      const signupData: SignUpAttributes = {
        email: this.emailControl.value || '',
        password: this.passwordControl.value || '',
      }
      await this.service.signUp(signupData);
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