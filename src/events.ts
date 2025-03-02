import type { Context } from './context';

// eslint-disable-next-line import/prefer-default-export
export enum UnleashEvents {
  Ready = 'ready',
  Error = 'error',
  Warn = 'warn',
  Unchanged = 'unchanged',
  Changed = 'changed',
  Synchronized = 'synchronized',
  Count = 'count',
  CountVariant = 'countVariant',
  Sent = 'sent',
  Registered = 'registered',
  Impression = 'impression',
}

export interface ImpressionEvent {
  // TODO: isFeatureEnabled, getFeatureVariant
  eventType: 'isEnabled' | 'getVariant';
  context: Context;
  enabled: boolean;
  featureName: string;
  variant?: string;
}

// Wrapper to provide type checking.
export function createImpressionEvent(event: ImpressionEvent): ImpressionEvent {
  return event;
}
