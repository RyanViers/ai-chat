import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` 
  <div class="h-screen w-screen flex flex-col bg-slate-900 text-white overflow-hidden">
    <router-outlet />
  </div>`,
})
export class AppComponent {}
