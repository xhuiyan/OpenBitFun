import { describe, expect, it } from 'vitest';
import { STARMATE_DOWNLOAD_URL, STARMATE_HOME_URL } from './links';

describe('MiniApp Market external links', () => {
  it('uses the official OpenBitFun website and download pages', () => {
    expect(STARMATE_HOME_URL).toBe('https://starmate.xtdl.ltd/');
    expect(STARMATE_DOWNLOAD_URL).toBe('https://starmate.xtdl.ltd/download');
    expect(new URL(STARMATE_HOME_URL).protocol).toBe('https:');
    expect(new URL(STARMATE_DOWNLOAD_URL).protocol).toBe('https:');
  });
});
