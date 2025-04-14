import {
  Directive,
  ElementRef,
  effect,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[scrollToBottom]',
  standalone: true,
})
export class ScrollToBottomDirective {
  private el = inject(ElementRef<HTMLElement>);

  readonly scrollToBottom = input<unknown>();

  constructor() {
    effect(() => {
      const _ = this.scrollToBottom(); // trigger on change
      queueMicrotask(() => {
        const container = this.el.nativeElement;
        container.scrollTop = container.scrollHeight;
      });
    });
  }
}
