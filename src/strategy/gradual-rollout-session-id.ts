import { Strategy } from './strategy';
import { normalizedStrategyValue } from './util';
import type { Context } from '../context';

export default class GradualRolloutSessionIdStrategy extends Strategy {
  constructor() {
    super('gradualRolloutSessionId');
  }

  isEnabled(parameters: any, context: Context) {
    const { sessionId } = context;
    if (!sessionId) {
      return false;
    }

    const percentage = Number(parameters.percentage);
    const groupId = parameters.groupId || '';

    const normalizedId = normalizedStrategyValue(sessionId, groupId);
    return percentage > 0 && normalizedId <= percentage;
  }
}
