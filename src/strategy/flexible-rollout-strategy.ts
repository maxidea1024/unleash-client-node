import { Strategy } from './strategy';
import type { Context } from '../context';
import { normalizedStrategyValue } from './util';
import { resolveContextValue } from '../helpers';

const STICKINESS = {
  default: 'default',
  random: 'random',
};

export default class FlexibleRolloutStrategy extends Strategy {
  private randomGenerator: Function = () => `${Math.round(Math.random() * 10000) + 1}`;

  constructor(randomGenerator?: Function) {
    super('flexibleRollout');

    if (randomGenerator) {
      this.randomGenerator = randomGenerator;
    }
  }

  isEnabled(parameters: any, context: Context) {
    const groupId = parameters.groupId || context.featureToggle || '';
    const percentage = Number(parameters.rollout);
    const stickiness: string = parameters.stickiness || STICKINESS.default;
    const stickinessId = this.resolveStickiness(stickiness, context);

    if (!stickinessId) {
      return false;
    }

    const normalizedUserId = normalizedStrategyValue(stickinessId, groupId);
    return percentage > 0 && normalizedUserId <= percentage;
  }

  private resolveStickiness(stickiness: string, context: Context): string {
    switch (stickiness) {
      case STICKINESS.default:
        return context.userId || context.sessionId || this.randomGenerator();
      case STICKINESS.random:
        return this.randomGenerator();
      default:
        return resolveContextValue(context, stickiness) || ''; // TODO: resolve에 실패했을때는 어떻게 처리하는게 바람직할까?
    }
  }
}
