import CustomSet, { Position } from './CustomSet';

describe('CustomSet', () => {
    let customSet: CustomSet;

    beforeEach(() => {
        customSet = new CustomSet();
    });

    describe('constructor', () => {
        it('should initialize an empty set', () => {
            expect(customSet.size).toBe(0);
        });
    });

    describe('add', () => {
        it('should add a position to the set', () => {
            customSet.add([1, 2]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1, 2])).toBe(true);
        });

        it('should add multiple positions to the set', () => {
            customSet.add([0, 0]);
            customSet.add([1, 1]);
            customSet.add([2, 3]);
            
            expect(customSet.size).toBe(3);
            expect(customSet.has([0, 0])).toBe(true);
            expect(customSet.has([1, 1])).toBe(true);
            expect(customSet.has([2, 3])).toBe(true);
        });

        it('should not increase size when adding duplicate positions', () => {
            customSet.add([1, 2]);
            customSet.add([1, 2]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1, 2])).toBe(true);
        });

        it('should handle negative coordinates', () => {
            customSet.add([-1, -2]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([-1, -2])).toBe(true);
        });

        it('should handle zero coordinates', () => {
            customSet.add([0, 0]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([0, 0])).toBe(true);
        });

        it('should handle large coordinates', () => {
            customSet.add([1000, 999]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1000, 999])).toBe(true);
        });
    });

    describe('has', () => {
        it('should return false for positions not in the set', () => {
            expect(customSet.has([1, 2])).toBe(false);
        });

        it('should return true for positions in the set', () => {
            customSet.add([1, 2]);
            
            expect(customSet.has([1, 2])).toBe(true);
        });

        it('should return false for similar but different positions', () => {
            customSet.add([1, 2]);
            
            expect(customSet.has([2, 1])).toBe(false);
            expect(customSet.has([1, 3])).toBe(false);
            expect(customSet.has([0, 2])).toBe(false);
        });

        it('should handle negative coordinates correctly', () => {
            customSet.add([-1, -2]);
            
            expect(customSet.has([-1, -2])).toBe(true);
            expect(customSet.has([1, -2])).toBe(false);
            expect(customSet.has([-1, 2])).toBe(false);
        });

        it('should distinguish between positive and negative coordinates', () => {
            customSet.add([1, 2]);
            customSet.add([-1, 2]);
            customSet.add([1, -2]);
            
            expect(customSet.has([1, 2])).toBe(true);
            expect(customSet.has([-1, 2])).toBe(true);
            expect(customSet.has([1, -2])).toBe(true);
            expect(customSet.has([-1, -2])).toBe(false);
        });
    });

    describe('delete', () => {
        it('should remove a position from the set', () => {
            customSet.add([1, 2]);
            customSet.delete([1, 2]);
            
            expect(customSet.size).toBe(0);
            expect(customSet.has([1, 2])).toBe(false);
        });

        it('should only remove the specified position', () => {
            customSet.add([1, 2]);
            customSet.add([2, 1]);
            customSet.add([3, 4]);
            
            customSet.delete([2, 1]);
            
            expect(customSet.size).toBe(2);
            expect(customSet.has([1, 2])).toBe(true);
            expect(customSet.has([2, 1])).toBe(false);
            expect(customSet.has([3, 4])).toBe(true);
        });

        it('should handle deleting non-existent positions gracefully', () => {
            customSet.add([1, 2]);
            customSet.delete([3, 4]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1, 2])).toBe(true);
        });

        it('should handle deleting from empty set gracefully', () => {
            customSet.delete([1, 2]);
            
            expect(customSet.size).toBe(0);
        });

        it('should handle negative coordinates correctly', () => {
            customSet.add([-1, -2]);
            customSet.add([1, 2]);
            
            customSet.delete([-1, -2]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([-1, -2])).toBe(false);
            expect(customSet.has([1, 2])).toBe(true);
        });
    });

    describe('clear', () => {
        it('should remove all positions from the set', () => {
            customSet.add([1, 2]);
            customSet.add([3, 4]);
            customSet.add([5, 6]);
            
            expect(customSet.size).toBe(3);
            
            customSet.clear();
            
            expect(customSet.size).toBe(0);
            expect(customSet.has([1, 2])).toBe(false);
            expect(customSet.has([3, 4])).toBe(false);
            expect(customSet.has([5, 6])).toBe(false);
        });

        it('should handle clearing an empty set gracefully', () => {
            customSet.clear();
            
            expect(customSet.size).toBe(0);
        });

        it('should allow adding positions after clearing', () => {
            customSet.add([1, 2]);
            customSet.clear();
            customSet.add([3, 4]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1, 2])).toBe(false);
            expect(customSet.has([3, 4])).toBe(true);
        });
    });

    describe('size', () => {
        it('should return 0 for empty set', () => {
            expect(customSet.size).toBe(0);
        });

        it('should return correct size after adding positions', () => {
            customSet.add([1, 2]);
            expect(customSet.size).toBe(1);
            
            customSet.add([3, 4]);
            expect(customSet.size).toBe(2);
            
            customSet.add([5, 6]);
            expect(customSet.size).toBe(3);
        });

        it('should return correct size after deleting positions', () => {
            customSet.add([1, 2]);
            customSet.add([3, 4]);
            customSet.add([5, 6]);
            
            expect(customSet.size).toBe(3);
            
            customSet.delete([3, 4]);
            expect(customSet.size).toBe(2);
            
            customSet.delete([1, 2]);
            expect(customSet.size).toBe(1);
            
            customSet.delete([5, 6]);
            expect(customSet.size).toBe(0);
        });

        it('should not change size when adding duplicates', () => {
            customSet.add([1, 2]);
            expect(customSet.size).toBe(1);
            
            customSet.add([1, 2]);
            expect(customSet.size).toBe(1);
        });

        it('should not change size when deleting non-existent positions', () => {
            customSet.add([1, 2]);
            expect(customSet.size).toBe(1);
            
            customSet.delete([3, 4]);
            expect(customSet.size).toBe(1);
        });
    });

    describe('values', () => {
        it('should return empty array for empty set', () => {
            const values = customSet.values();
            
            expect(values).toEqual([]);
            expect(Array.isArray(values)).toBe(true);
        });

        it('should return array of Position objects', () => {
            customSet.add([1, 2]);
            customSet.add([3, 4]);
            
            const values = customSet.values();
            
            expect(values).toHaveLength(2);
            expect(values[0]).toEqual({ row: 1, col: 2 });
            expect(values[1]).toEqual({ row: 3, col: 4 });
        });

        it('should return positions sorted by row then by column', () => {
            customSet.add([3, 1]);
            customSet.add([1, 3]);
            customSet.add([2, 2]);
            customSet.add([1, 1]);
            customSet.add([3, 2]);
            
            const values = customSet.values();
            
            expect(values).toEqual([
                { row: 1, col: 1 },
                { row: 1, col: 3 },
                { row: 2, col: 2 },
                { row: 3, col: 1 },
                { row: 3, col: 2 }
            ]);
        });

        it('should handle negative coordinates in sorting', () => {
            customSet.add([1, -1]);
            customSet.add([-1, 1]);
            customSet.add([0, 0]);
            customSet.add([-1, -1]);
            
            const values = customSet.values();
            
            expect(values).toEqual([
                { row: -1, col: -1 },
                { row: -1, col: 1 },
                { row: 0, col: 0 },
                { row: 1, col: -1 }
            ]);
        });

        it('should return fresh array (not reference to internal data)', () => {
            customSet.add([1, 2]);
            
            const values1 = customSet.values();
            const values2 = customSet.values();
            
            expect(values1).not.toBe(values2); // Different array instances
            expect(values1).toEqual(values2); // Same content
        });

        it('should handle large number of positions', () => {
            // Add positions in reverse order to test sorting
            for (let row = 10; row >= 0; row--) {
                for (let col = 10; col >= 0; col--) {
                    customSet.add([row, col]);
                }
            }
            
            const values = customSet.values();
            
            expect(values).toHaveLength(121); // 11x11 grid
            
            // Verify sorting - first few should be (0,0), (0,1), (0,2)...
            expect(values[0]).toEqual({ row: 0, col: 0 });
            expect(values[1]).toEqual({ row: 0, col: 1 });
            expect(values[2]).toEqual({ row: 0, col: 2 });
            
            // Last should be (10,10)
            expect(values[120]).toEqual({ row: 10, col: 10 });
        });
    });

    describe('complex operations', () => {
        it('should handle mixed operations correctly', () => {
            // Add several positions
            customSet.add([1, 1]);
            customSet.add([2, 2]);
            customSet.add([3, 3]);
            expect(customSet.size).toBe(3);
            
            // Delete one
            customSet.delete([2, 2]);
            expect(customSet.size).toBe(2);
            expect(customSet.has([2, 2])).toBe(false);
            
            // Add duplicate
            customSet.add([1, 1]);
            expect(customSet.size).toBe(2);
            
            // Add new position
            customSet.add([4, 4]);
            expect(customSet.size).toBe(3);
            
            // Verify final state
            const values = customSet.values();
            expect(values).toEqual([
                { row: 1, col: 1 },
                { row: 3, col: 3 },
                { row: 4, col: 4 }
            ]);
        });

        it('should maintain consistency through multiple operations', () => {
            const positions: [number, number][] = [
                [0, 0], [0, 1], [1, 0], [1, 1], [2, 2]
            ];
            
            // Add all positions
            positions.forEach(pos => customSet.add(pos));
            expect(customSet.size).toBe(5);
            
            // Verify all exist
            positions.forEach(pos => {
                expect(customSet.has(pos)).toBe(true);
            });
            
            // Remove some positions
            customSet.delete([0, 1]);
            customSet.delete([1, 0]);
            expect(customSet.size).toBe(3);
            
            // Verify correct positions remain
            expect(customSet.has([0, 0])).toBe(true);
            expect(customSet.has([0, 1])).toBe(false);
            expect(customSet.has([1, 0])).toBe(false);
            expect(customSet.has([1, 1])).toBe(true);
            expect(customSet.has([2, 2])).toBe(true);
            
            // Clear and verify empty
            customSet.clear();
            expect(customSet.size).toBe(0);
            positions.forEach(pos => {
                expect(customSet.has(pos)).toBe(false);
            });
        });
    });

    describe('edge cases', () => {
        it('should handle coordinates with same string representation differently', () => {
            // These could potentially have similar string keys if not handled properly
            customSet.add([12, 3]);  // "12,3"
            customSet.add([1, 23]);  // "1,23"
            
            expect(customSet.size).toBe(2);
            expect(customSet.has([12, 3])).toBe(true);
            expect(customSet.has([1, 23])).toBe(true);
        });

        it('should handle zero and positive zero correctly', () => {
            customSet.add([0, 0]);
            customSet.add([-0, 0]); // -0 should be treated as 0
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([0, 0])).toBe(true);
        });

        it('should handle very large coordinates', () => {
            const largeNum = Number.MAX_SAFE_INTEGER;
            customSet.add([largeNum, largeNum]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([largeNum, largeNum])).toBe(true);
        });

        it('should handle floating point coordinates (though not typical use case)', () => {
            customSet.add([1.5, 2.7]);
            
            expect(customSet.size).toBe(1);
            expect(customSet.has([1.5, 2.7])).toBe(true);
            expect(customSet.has([1, 2])).toBe(false);
        });
    });
});