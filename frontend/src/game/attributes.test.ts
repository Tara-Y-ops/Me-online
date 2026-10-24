import { describe, expect, it } from 'vitest';
import { clampScore, formatPercent, percentToward } from './attributes';

describe('clampScore', () => {
  it('keeps scores inside 0 to 100', () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(42)).toBe(42);
    expect(clampScore(105)).toBe(100);
  });
});

describe('percentToward', () => {
  it('matches the PRD example: score 35 is 65% toward the low pole', () => {
    expect(percentToward(35, 'low')).toBe(65);
    expect(percentToward(35, 'high')).toBe(35);
  });
});

describe('formatPercent', () => {
  it('always shows one decimal place', () => {
    expect(formatPercent(65)).toBe('65.0%');
    expect(formatPercent(50.25)).toBe('50.3%');
  });

  it('hides floating-point noise', () => {
    // 100 - 64.9 is 35.099999... in floating point.
    expect(formatPercent(percentToward(64.9, 'low'))).toBe('35.1%');
  });
});
