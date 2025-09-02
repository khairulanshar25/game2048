import { formatCell, formatCell2, centerString, padLeft, padRight } from './string';

describe('string utilities', () => {
    describe('formatCell', () => {
        it('should format null as "null"', () => {
            expect(formatCell(null)).toBe('null');
        });
        it('should format number with default width', () => {
            expect(formatCell(2)).toBe(' 2  ');
            expect(formatCell(123)).toBe('123 ');
            expect(formatCell(2048)).toBe('2048');
        });
        it('should format number with custom width', () => {
            expect(formatCell(2, 6)).toBe('  2   '); // 2 left, 3 right
            expect(formatCell(123, 6)).toBe(' 123  '); // 1 left, 2 right
            expect(formatCell(2048, 6)).toBe(' 2048 '); // 1 left, 1 right
        });
        it('should not pad if number length >= width', () => {
            expect(formatCell(12345, 4)).toBe('12345');
            expect(formatCell(12345, 5)).toBe('12345');
        });
        it('should handle negative numbers', () => {
            expect(formatCell(-2)).toBe(' -2 '); // 1 left, 1 right
            expect(formatCell(-123, 6)).toBe(' -123 '); // 1 left, 1 right
        });
    });

    describe('formatCell2', () => {
        it('should format null as "null"', () => {
            expect(formatCell2(null)).toBe('null');
        });
        it('should format number as string', () => {
            expect(formatCell2(2)).toBe('2');
            expect(formatCell2(123)).toBe('123');
            expect(formatCell2(2048)).toBe('2048');
        });
        it('should handle negative numbers', () => {
            expect(formatCell2(-2)).toBe('-2');
        });
    });

    describe('centerString', () => {
        it('should center string with default fillChar', () => {
            expect(centerString('hi', 6)).toBe('  hi  ');
            expect(centerString('abc', 7)).toBe('  abc  ');
        });
        it('should center string with custom fillChar', () => {
            expect(centerString('hi', 6, '-')).toBe('--hi--');
            expect(centerString('abc', 7, '*')).toBe('**abc**');
        });
        it('should not pad if text length >= width', () => {
            expect(centerString('hello', 3)).toBe('hello');
            expect(centerString('world', 5)).toBe('world');
        });
        it('should handle empty string', () => {
            expect(centerString('', 4)).toBe('    ');
        });
    });

    describe('padLeft', () => {
        it('should pad string to the left with default fillChar', () => {
            expect(padLeft('hi', 5)).toBe('   hi');
            expect(padLeft('abc', 6)).toBe('   abc');
        });
        it('should pad string to the left with custom fillChar', () => {
            expect(padLeft('hi', 5, '-')).toBe('---hi');
            expect(padLeft('abc', 6, '*')).toBe('***abc');
        });
        it('should not pad if text length >= width', () => {
            expect(padLeft('hello', 3)).toBe('hello');
            expect(padLeft('world', 5)).toBe('world');
        });
        it('should handle empty string', () => {
            expect(padLeft('', 4)).toBe('    ');
        });
    });

    describe('padRight', () => {
        it('should pad string to the right with default fillChar', () => {
            expect(padRight('hi', 5)).toBe('hi   ');
            expect(padRight('abc', 6)).toBe('abc   ');
        });
        it('should pad string to the right with custom fillChar', () => {
            expect(padRight('hi', 5, '-')).toBe('hi---');
            expect(padRight('abc', 6, '*')).toBe('abc***');
        });
        it('should not pad if text length >= width', () => {
            expect(padRight('hello', 3)).toBe('hello');
            expect(padRight('world', 5)).toBe('world');
        });
        it('should handle empty string', () => {
            expect(padRight('', 4)).toBe('    ');
        });
    });
});
