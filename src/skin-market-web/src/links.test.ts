import { describe, expect, it } from 'vitest';
import { STARMATE_DOWNLOAD_URL, STARMATE_HOME_URL } from './links';

describe('Skin Market external links', () => {
  it('uses the official OpenBitFun website and download pages', () => {
    expect(STARMATE_HOME_URL).toBe('https://openbitfun.com/');
    expect(STARMATE_DOWNLOAD_URL).toBe('https://openbitfun.com/download');
    expect(new URL(STARMATE_HOME_URL).protocol).toBe('https:');
    expect(new URL(STARMATE_DOWNLOAD_URL).protocol).toBe('https:');
  });
});
