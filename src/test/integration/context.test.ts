import test from 'ava';
import * as nock from 'nock';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirp } from 'mkdirp';

import { Unleash } from '../../unleash';

let counter = 1;
const getUrl = () => `http://client-spec-${counter++}.app/`;

const getRandomBackupPath = (testName: string) => {
  const path = join(tmpdir(), `test-${testName}-${Math.round(Math.random() * 100000)}`);
  mkdirp.sync(path);
  return path;
};

const mockNetwork = (flags: typeof FLAGS, url = getUrl()) => {
  nock(url).get('/client/features').reply(200, flags);
  return url;
};

const FLAG = 'context.test.flag';
const STRING_CTX = 'yes';
const NUMBER_CTX = 7;
const BOOL_CTX = true;

const FLAGS = {
  version: 1,
  features: [
    {
      name: FLAG,
      description: 'Tests that context is properly handled',
      enabled: true,
      strategies: [
        {
          name: 'default',
          constraints: [
            {
              contextName: 'test',
              operator: 'IN',
              values: [STRING_CTX, NUMBER_CTX.toString(), BOOL_CTX.toString()],
            },
          ],
        },
      ],
    },
  ],
};

test('should be enabled for string context field', (t) =>
  new Promise((resolve, reject) => {
    // Mock unleash-api
    const url = mockNetwork(FLAGS);

    // New unleash instance
    const instance = new Unleash({
      appName: 'Test',
      disableMetrics: true,
      environment: 'test',
      url,
      backupPath: getRandomBackupPath('test-context'),
    });

    instance.on('error', reject);
    instance.on('synchronized', () => {
      const result = instance.isEnabled(FLAG, { properties: { test: STRING_CTX } });
      t.is(result, true);
      instance.destroy();
      resolve();
    });
  }));

test('should be enabled for number context field', (t) =>
  new Promise((resolve, reject) => {
    // Mock unleash-api
    const url = mockNetwork(FLAGS);

    // New unleash instance
    const instance = new Unleash({
      appName: 'Test',
      disableMetrics: true,
      environment: 'test',
      url,
      backupPath: getRandomBackupPath('test-context'),
    });

    instance.on('error', reject);
    instance.on('synchronized', () => {
      const result = instance.isEnabled(FLAG, { properties: { test: NUMBER_CTX } });
      t.is(result, true);
      instance.destroy();
      resolve();
    });
  }));

test('should be enabled for boolean context field', (t) =>
  new Promise((resolve, reject) => {
    // Mock unleash-api
    const url = mockNetwork(FLAGS);

    // New unleash instance
    const instance = new Unleash({
      appName: 'Test',
      disableMetrics: true,
      environment: 'test',
      url,
      backupPath: getRandomBackupPath('test-context'),
    });

    instance.on('error', reject);
    instance.on('synchronized', () => {
      // @ts-expect-error
      const result = instance.isEnabled(FLAG, { properties: { test: BOOL_CTX } });
      t.is(result, true);
      instance.destroy();
      resolve();
    });
  }));

test('should gracefully handle null or undefined context fields', (t) =>
  new Promise((resolve, reject) => {
    // Mock unleash-api
    const url = mockNetwork(FLAGS);

    // New unleash instance
    const instance = new Unleash({
      appName: 'Test',
      disableMetrics: true,
      environment: 'test',
      url,
      backupPath: getRandomBackupPath('test-context'),
    });

    instance.on('error', reject);
    instance.on('synchronized', () => {
      // @ts-expect-error
      const result1 = instance.isEnabled(FLAG, { properties: { test: null } });
      t.is(result1, false);
      const result2 = instance.isEnabled(FLAG, { properties: { test: undefined } });
      t.is(result2, false);
      instance.destroy();
      resolve();
    });
  }));
