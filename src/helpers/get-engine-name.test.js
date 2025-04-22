/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import getEngineName from './get-engine-name';

describe('getEngineName', () => {
  it('returns the engine name for known engines', () => {
    expect(getEngineName('chrome')).toBe('Google Chrome');
    expect(getEngineName('firefox')).toBe('Mozilla Firefox');
    expect(getEngineName('edge')).toBe('Microsoft Edge');
    expect(getEngineName('brave')).toBe('Brave');
  });

  it('returns the engine ID for unknown engines', () => {
    expect(getEngineName('unknown-engine')).toBe('unknown-engine');
  });

  it('returns an empty string for null or undefined input', () => {
    expect(getEngineName(null)).toBe('');
    expect(getEngineName(undefined)).toBe('');
  });

  it('appends (tabbed) to engine name for tabbed mode', () => {
    expect(getEngineName('chrome/tabs')).toBe('Google Chrome (tabbed)');
    expect(getEngineName('firefox/tabs')).toBe('Mozilla Firefox (tabbed)');
  });

  it('handles modern browser engines', () => {
    expect(getEngineName('arc')).toBe('Arc Browser');
    expect(getEngineName('operaGX')).toBe('Opera GX');
    expect(getEngineName('operaOne')).toBe('Opera One');
    expect(getEngineName('firefoxDeveloperEdition')).toBe('Firefox Developer Edition');
  });
});