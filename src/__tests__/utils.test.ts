import { cn, countWords, estimateReadingTime, truncate, formatDate } from '@/lib/utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz'); // eslint-disable-line no-constant-binary-expression
  });

  it('should merge conflicting Tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});

describe('countWords', () => {
  it('should count words in a sentence', () => {
    expect(countWords('Hello world')).toBe(2);
  });

  it('should handle empty strings', () => {
    expect(countWords('')).toBe(0);
  });

  it('should handle multiple spaces', () => {
    expect(countWords('Hello   world')).toBe(2);
  });

  it('should handle newlines', () => {
    expect(countWords('Hello\nworld\nfoo')).toBe(3);
  });
});

describe('estimateReadingTime', () => {
  it('should estimate reading time based on word count', () => {
    // 150 words = 1 minute (rounded up)
    expect(estimateReadingTime(150)).toBe(1);
    expect(estimateReadingTime(200)).toBe(2);
    expect(estimateReadingTime(300)).toBe(2);
    expect(estimateReadingTime(450)).toBe(3);
  });
});

describe('truncate', () => {
  it('should truncate long text with ellipsis', () => {
    expect(truncate('Hello world foo bar', 10)).toBe('Hello w...');
  });

  it('should not truncate short text', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });
});

describe('formatDate', () => {
  it('should format a date string', () => {
    const result = formatDate('2025-12-25');
    expect(result).toContain('December');
    expect(result).toContain('25');
    expect(result).toContain('2025');
  });

  it('should format a Date object', () => {
    const result = formatDate(new Date('2025-01-15'));
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });
});

