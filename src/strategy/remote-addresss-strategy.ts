import { Strategy } from './strategy';
import type { Context } from '../context';
import { Address4 } from 'ip-address';

export default class RemoteAddressStrategy extends Strategy {
  constructor() {
    super('remoteAddress');
  }

  isEnabled(parameters: any, context: Context) {
    if (!parameters.IPs) {
      return false;
    }

    return parameters.IPs.split(/\s*,\s*/).some((range: string): boolean => {
      if (range === context.remoteAddress) {
        return true;
      }

      try {
        const subnetRange = new Address4(range);
        const remoteAddress = new Address4(context.remoteAddress || '');
        return remoteAddress.isInSubnet(subnetRange);
      } catch (err: unknown) {
        return false;
      }
    });
  }
}
