import { Signal } from '@angular/core';

/**
 * Base props that all components should accept
 */
export interface BaseComponentProps {
  class?: string;
  id?: string;
}

/**
 * Size variants used across components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants used across components
 */
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

/**
 * Button specific variants
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'soft' 
  | 'outline' 
  | 'ghost' 
  | 'link';

/**
 * Input states
 */
export type InputState = 'default' | 'error' | 'success' | 'disabled';

/**
 * Generic component props with signals
 */
export interface ComponentSignals<T = any> {
  [key: string]: Signal<T>;
}

/**
 * Event handler type
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Loading state type
 */
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}
