import { selectRandom } from './array';

describe('array utilities', () => {
    describe('selectRandom', () => {
        beforeEach(() => {
            // Reset Math.random mock before each test
            jest.restoreAllMocks();
        });

        it('should return undefined for empty array', () => {
            const result = selectRandom([]);
            expect(result).toBeUndefined();
        });

        it('should return the only element from single-element array', () => {
            const array = ['single'];
            const result = selectRandom(array);
            expect(result).toBe('single');
        });

        it('should return an element from the array', () => {
            const array = ['a', 'b', 'c', 'd'];
            const result = selectRandom(array);
            expect(array).toContain(result);
        });

        it('should work with different data types', () => {
            // Test with numbers
            const numbers = [1, 2, 3, 4, 5];
            const numberResult = selectRandom(numbers);
            expect(numbers).toContain(numberResult);

            // Test with objects
            const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const objectResult = selectRandom(objects);
            expect(objects).toContain(objectResult);

            // Test with booleans
            const booleans = [true, false];
            const booleanResult = selectRandom(booleans);
            expect(booleans).toContain(booleanResult);
        });

        it('should use Math.random to select index', () => {
            const array = ['a', 'b', 'c', 'd'];
            
            // Mock Math.random to return 0.25 (should select index 1)
            jest.spyOn(Math, 'random').mockReturnValue(0.25);
            const result = selectRandom(array);
            
            expect(Math.random).toHaveBeenCalled();
            expect(result).toBe('b'); // index 1
        });

        it('should handle Math.random edge cases', () => {
            const array = ['first', 'second', 'third'];
            
            // Test Math.random returning 0 (should select first element)
            jest.spyOn(Math, 'random').mockReturnValue(0);
            let result = selectRandom(array);
            expect(result).toBe('first');
            
            // Test Math.random returning close to 1 (should select last element)
            jest.spyOn(Math, 'random').mockReturnValue(0.999);
            result = selectRandom(array);
            expect(result).toBe('third');
        });

        it('should have uniform distribution over multiple calls', () => {
            const array = ['a', 'b', 'c'];
            const results: { [key: string]: number } = {};
            const iterations = 1000;
            
            // Reset to use real Math.random for distribution test
            jest.restoreAllMocks();
            
            // Collect results over many iterations
            for (let i = 0; i < iterations; i++) {
                const result = selectRandom(array);
                if (result) {
                    results[result] = (results[result] || 0) + 1;
                }
            }
            
            // Each element should appear roughly 1/3 of the time
            // Allow for some variance in random distribution
            const expectedCount = iterations / array.length;
            const tolerance = expectedCount * 0.2; // 20% tolerance
            
            expect(Object.keys(results)).toHaveLength(3);
            Object.values(results).forEach(count => {
                expect(count).toBeGreaterThan(expectedCount - tolerance);
                expect(count).toBeLessThan(expectedCount + tolerance);
            });
        });

        it('should not modify the original array', () => {
            const originalArray = ['a', 'b', 'c'];
            const arrayCopy = [...originalArray];
            
            selectRandom(originalArray);
            
            expect(originalArray).toEqual(arrayCopy);
        });

        it('should handle large arrays efficiently', () => {
            // Create a large array
            const largeArray = Array.from({ length: 10000 }, (_, i) => i);
            
            const start = performance.now();
            const result = selectRandom(largeArray);
            const end = performance.now();
            
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(10000);
            expect(end - start).toBeLessThan(10); // Should complete in under 10ms
        });

        it('should work with arrays containing null and undefined', () => {
            const arrayWithNulls = [null, undefined, 'valid', null];
            const result = selectRandom(arrayWithNulls);
            
            expect(arrayWithNulls).toContain(result);
        });

        it('should maintain type safety', () => {
            // This test verifies TypeScript compilation
            const stringArray = ['a', 'b', 'c'];
            const stringResult: string | undefined = selectRandom(stringArray);
            expect(typeof stringResult === 'string' || stringResult === undefined).toBe(true);
            
            const numberArray = [1, 2, 3];
            const numberResult: number | undefined = selectRandom(numberArray);
            expect(typeof numberResult === 'number' || numberResult === undefined).toBe(true);
        });

        it('should handle arrays with duplicate elements', () => {
            const arrayWithDuplicates = ['a', 'a', 'b', 'a', 'c'];
            const result = selectRandom(arrayWithDuplicates);
            
            expect(arrayWithDuplicates).toContain(result);
            
            // Verify it can return any of the duplicates
            const possibleResults = new Set();
            for (let i = 0; i < 100; i++) {
                possibleResults.add(selectRandom(arrayWithDuplicates));
            }
            
            expect(possibleResults.has('a')).toBe(true);
            expect(possibleResults.has('b')).toBe(true);
            expect(possibleResults.has('c')).toBe(true);
        });
    });
});