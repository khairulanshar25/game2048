// Mock all dependencies before imports
jest.mock('../utils/logger');
jest.mock('../utils/string');
jest.mock('../utils/array');
jest.mock('../utils/CustomSet');
jest.mock('../ai-helpers');
jest.mock('chalk');

import { Board } from './index';
import logger from '../utils/logger';
import { formatCell, formatCell2 } from '../utils/string';
import { selectRandom } from '../utils/array';
import CustomSet from '../utils/CustomSet';
import { AIHelper } from '../ai-helpers';
import chalk from 'chalk';

// Setup mocks
const mockLogger = logger as jest.Mocked<typeof logger>;
const mockFormatCell = formatCell as jest.MockedFunction<typeof formatCell>;
const mockFormatCell2 = formatCell2 as jest.MockedFunction<typeof formatCell2>;
const mockSelectRandom = selectRandom as jest.MockedFunction<typeof selectRandom>;
const mockChalk = chalk as jest.Mocked<typeof chalk>;

// Mock CustomSet
const mockCustomSet = {
    clear: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
    values: jest.fn(),
    size: 0
};

// Mock AIHelper
const mockAIHelper = {
    suggestMove: jest.fn()
};

(CustomSet as jest.MockedClass<typeof CustomSet>).mockImplementation(() => mockCustomSet as any);
(AIHelper as jest.MockedClass<typeof AIHelper>).mockImplementation(() => mockAIHelper as any);

// Mock Math.random to make tests deterministic
const originalMathRandom = Math.random;
const mockMathRandom = jest.fn();
Math.random = mockMathRandom;

// Mock console spy for error cases
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset CustomSet mock
        mockCustomSet.size = 16; // 4x4 board initially empty
        mockCustomSet.clear.mockClear();
        mockCustomSet.add.mockClear();
        mockCustomSet.delete.mockClear();
        mockCustomSet.has.mockClear();
        mockCustomSet.values.mockReturnValue([{ row: 0, col: 0 }]);
        
        // Setup formatCell mocks
        mockFormatCell.mockImplementation((cell) => cell === null ? '    ' : cell.toString().padStart(4));
        mockFormatCell2.mockImplementation((cell) => cell === null ? 'null' : cell.toString());
        
        // Setup selectRandom mock
        mockSelectRandom.mockReturnValue({ row: 0, col: 0 });
        
        // Setup Math.random mock
        mockMathRandom.mockReturnValue(0.5); // Will generate 2 (< 0.9)
        
        // Setup chalk mock
        (mockChalk as any).yellow = jest.fn((text: string) => `yellow(${text})`);
        
        // Create new board instance
        board = new Board();
    });

    afterAll(() => {
        Math.random = originalMathRandom;
        consoleErrorSpy.mockRestore();
    });

    describe('constructor', () => {
        it('should initialize board with correct size and empty cells', () => {
            expect(CustomSet).toHaveBeenCalledTimes(1);
            expect(AIHelper).toHaveBeenCalledTimes(1);
            expect(mockCustomSet.clear).toHaveBeenCalled();
            // Should have added 16 positions (4x4) to available cells
            expect(mockCustomSet.add).toHaveBeenCalledTimes(16);
        });

        it('should call insertRandomNumber during initialization', () => {
            expect(mockSelectRandom).toHaveBeenCalled();
        });
    });

    describe('getBoard', () => {
        it('should return the current board state', () => {
            const boardState = board.getBoard();
            expect(Array.isArray(boardState)).toBe(true);
            expect(boardState.length).toBe(4);
            expect(boardState[0].length).toBe(4);
        });
    });

    describe('getScore', () => {
        it('should return initial score as 0', () => {
            expect(board.getScore()).toBe(0);
        });
    });

    describe('getCell', () => {
        it('should return cell value for valid position', () => {
            const cell = board.getCell(0, 0);
            expect(typeof cell === 'number' || cell === null).toBe(true);
        });

        it('should throw error for invalid row position (negative)', () => {
            expect(() => board.getCell(-1, 0)).toThrow('getCell Invalid position: (-1, 0)');
        });

        it('should throw error for invalid row position (too large)', () => {
            expect(() => board.getCell(4, 0)).toThrow('getCell Invalid position: (4, 0)');
        });

        it('should throw error for invalid column position (negative)', () => {
            expect(() => board.getCell(0, -1)).toThrow('getCell Invalid position: (0, -1)');
        });

        it('should throw error for invalid column position (too large)', () => {
            expect(() => board.getCell(0, 4)).toThrow('getCell Invalid position: (0, 4)');
        });
    });

    describe('setCell', () => {
        it('should set cell value for valid position', () => {
            board.setCell(1, 1, 4);
            expect(board.getCell(1, 1)).toBe(4);
        });

        it('should update availableCells when setting non-null value', () => {
            board.setCell(1, 1, 4);
            expect(mockCustomSet.delete).toHaveBeenCalledWith([1, 1]);
        });

        it('should update availableCells when setting null value', () => {
            // First set a value, then set it back to null
            board.setCell(1, 1, 4);
            mockCustomSet.delete.mockClear();
            board.setCell(1, 1, null);
            expect(mockCustomSet.add).toHaveBeenCalledWith([1, 1]);
        });

        it('should throw error for invalid position', () => {
            expect(() => board.setCell(-1, 0, 2)).toThrow('setCell Invalid position: (-1, 0)');
            expect(() => board.setCell(4, 0, 2)).toThrow('setCell Invalid position: (4, 0)');
            expect(() => board.setCell(0, -1, 2)).toThrow('setCell Invalid position: (0, -1)');
            expect(() => board.setCell(0, 4, 2)).toThrow('setCell Invalid position: (0, 4)');
        });
    });

    describe('reset', () => {
        it('should reset board and insert random number', () => {
            // Modify board first
            board.setCell(1, 1, 8);
            mockCustomSet.clear.mockClear();
            mockSelectRandom.mockClear();
            
            board.reset();
            
            expect(mockCustomSet.clear).toHaveBeenCalled();
            expect(mockSelectRandom).toHaveBeenCalled();
        });
    });

    describe('display', () => {
        it('should log current score and board state', () => {
            board.display();
            
            expect(mockLogger.info).toHaveBeenCalledWith('Current Score: 0');
            expect(mockLogger.info).toHaveBeenCalledWith('Current Board:');
            // Should log 4 rows
            expect(mockLogger.info).toHaveBeenCalledTimes(6); // title + score + 4 rows
        });
    });

    describe('isFull', () => {
        it('should return false when board has available cells', () => {
            mockCustomSet.size = 1;
            expect(board.isFull()).toBe(false);
        });

        it('should return true when no available cells', () => {
            mockCustomSet.size = 0;
            expect(board.isFull()).toBe(true);
        });
    });

    describe('insertRandomNumber', () => {
        it('should insert multiple random numbers', () => {
            mockMathRandom.mockReturnValue(0.3); // Will create 2 loops
            mockSelectRandom.mockClear();
            
            const result = board.insertRandomNumber();
            
            expect(result).toBe(true);
            expect(mockSelectRandom).toHaveBeenCalled();
        });
    });

    describe('insertRandomNumberOnce', () => {
        it('should insert a 2 when random < 0.9', () => {
            mockMathRandom.mockReturnValue(0.5);
            mockSelectRandom.mockReturnValue({ row: 1, col: 1 });
            
            const result = board.insertRandomNumberOnce();
            
            expect(result).toBe(true);
            expect(board.getCell(1, 1)).toBe(2);
        });

        it('should insert a 4 when random >= 0.9', () => {
            mockMathRandom.mockReturnValue(0.95);
            mockSelectRandom.mockReturnValue({ row: 1, col: 1 });
            
            const result = board.insertRandomNumberOnce();
            
            expect(result).toBe(true);
            expect(board.getCell(1, 1)).toBe(4);
        });
    });

    describe('insertNumberAtRandomPosition', () => {
        it('should insert specified value at random position', () => {
            mockCustomSet.size = 1; // Not full
            mockSelectRandom.mockReturnValue({ row: 2, col: 2 });
            
            const result = board.insertNumberAtRandomPosition(8);
            
            expect(result).toBe(true);
            expect(board.getCell(2, 2)).toBe(8);
        });

        it('should return false when board is full', () => {
            mockCustomSet.size = 0; // Full board
            
            const result = board.insertNumberAtRandomPosition(8);
            
            expect(result).toBe(false);
        });

        it('should return false when no selected cell', () => {
            mockCustomSet.size = 1; // Not full
            mockSelectRandom.mockReturnValue(null);
            
            const result = board.insertNumberAtRandomPosition(8);
            
            expect(result).toBe(false);
        });
    });

    describe('move history', () => {
        it('should collect move history with correct data', () => {
            const move = { direction: 'up' as const };
            
            const history = board.collectMoveHistory(move);
            
            expect(history.length).toBe(1);
            expect(history[0].direction).toBe('up');
            expect(history[0].score).toBe(0);
            expect(history[0].gameBoard).toBeDefined();
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it('should return move history', () => {
            board.collectMoveHistory({ direction: 'left' });
            board.collectMoveHistory({ direction: 'right' });
            
            const history = board.getMoveHistory();
            
            expect(history.length).toBe(2);
            expect(history[0].direction).toBe('left');
            expect(history[1].direction).toBe('right');
        });

        it('should return move history as string', () => {
            board.collectMoveHistory({ direction: 'up' });
            
            const historyString = board.getMoveHistoryString();
            
            expect(typeof historyString).toBe('string');
            expect(historyString).toContain('Direction: up');
            expect(historyString).toContain('Score: 0');
        });
    });

    describe('isGameOver', () => {
        it('should return false when board is not full', () => {
            mockCustomSet.size = 1; // Not full
            
            expect(board.isGameOver()).toBe(false);
        });

        it('should return false when horizontal merge is possible', () => {
            mockCustomSet.size = 0; // Full board
            // Set up board with possible horizontal merge
            board.setCell(0, 0, 2);
            board.setCell(0, 1, 2);
            
            expect(board.isGameOver()).toBe(false);
        });

        it('should return false when vertical merge is possible', () => {
            mockCustomSet.size = 0; // Full board
            // Set up board with possible vertical merge
            board.setCell(0, 0, 4);
            board.setCell(1, 0, 4);
            
            expect(board.isGameOver()).toBe(false);
        });

        it('should return true when no moves are possible', () => {
            mockCustomSet.size = 0; // Full board
            // Set up board with no possible merges
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    board.setCell(row, col, (row * 4 + col + 1) * 2); // All different values
                }
            }
            
            expect(board.isGameOver()).toBe(true);
        });
    });

    describe('merge operations', () => {
        beforeEach(() => {
            // Reset board to known state for merge tests
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    board.setCell(row, col, null);
                }
            }
            // Mock insertRandomNumber to prevent interference with merge tests
            jest.spyOn(board, 'insertRandomNumber').mockImplementation(() => false);
        });

        describe('mergeUp', () => {
            it('should move cells upward', () => {
                board.setCell(2, 0, 2);
                
                board.mergeUp();
                
                expect(board.getCell(0, 0)).toBe(2);
                expect(board.getCell(2, 0)).toBe(null);
            });

            it('should merge identical adjacent cells upward', () => {
                board.setCell(1, 0, 2);
                board.setCell(2, 0, 2);
                
                board.mergeUp();
                
                expect(board.getCell(0, 0)).toBe(4);
                expect(board.getCell(1, 0)).toBe(null);
                expect(board.getCell(2, 0)).toBe(null);
                expect(board.getScore()).toBe(4);
            });

            it('should not merge cells that already merged in same move', () => {
                board.setCell(0, 0, 2);
                board.setCell(1, 0, 2);
                board.setCell(2, 0, 2);
                
                board.mergeUp();
                
                expect(board.getCell(0, 0)).toBe(4);
                expect(board.getCell(1, 0)).toBe(2);
                expect(board.getCell(2, 0)).toBe(null);
                expect(board.getScore()).toBe(4);
            });
        });

        describe('mergeDown', () => {
            it('should move cells downward', () => {
                board.setCell(1, 0, 2);
                
                board.mergeDown();
                
                expect(board.getCell(3, 0)).toBe(2);
                expect(board.getCell(1, 0)).toBe(null);
            });

            it('should merge identical adjacent cells downward', () => {
                board.setCell(1, 0, 2);
                board.setCell(2, 0, 2);
                mockSelectRandom.mockClear();
                
                board.mergeDown();
                
                expect(board.getCell(3, 0)).toBe(4);
                expect(board.getCell(1, 0)).toBe(null);
                expect(board.getCell(2, 0)).toBe(null);
                expect(board.getScore()).toBe(4);
            });
        });

        describe('mergeLeft', () => {
            it('should move cells leftward', () => {
                board.setCell(0, 2, 2);
                
                board.mergeLeft();
                
                expect(board.getCell(0, 0)).toBe(2);
                expect(board.getCell(0, 2)).toBe(null);
            });

            it('should merge identical adjacent cells leftward', () => {
                board.setCell(0, 1, 2);
                board.setCell(0, 2, 2);
                mockSelectRandom.mockClear();
                
                board.mergeLeft();
                
                expect(board.getCell(0, 0)).toBe(4);
                expect(board.getCell(0, 1)).toBe(null);
                expect(board.getCell(0, 2)).toBe(null);
                expect(board.getScore()).toBe(4);
            });
        });

        describe('mergeRight', () => {
            it('should move cells rightward', () => {
                board.setCell(0, 1, 2);
                
                board.mergeRight();
                
                expect(board.getCell(0, 3)).toBe(2);
                expect(board.getCell(0, 1)).toBe(null);
            });

            it('should merge identical adjacent cells rightward', () => {
                board.setCell(0, 1, 2);
                board.setCell(0, 2, 2);
                mockSelectRandom.mockClear();
                
                board.mergeRight();
                
                expect(board.getCell(0, 3)).toBe(4);
                expect(board.getCell(0, 1)).toBe(null);
                expect(board.getCell(0, 2)).toBe(null);
                expect(board.getScore()).toBe(4);
            });
        });
    });

    describe('complex merge scenarios', () => {
        beforeEach(() => {
            // Reset board to known state
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    board.setCell(row, col, null);
                }
            }
            // Mock insertRandomNumber for complex scenarios
            jest.spyOn(board, 'insertRandomNumber').mockImplementation(() => false);
        });

        it('should handle multiple merges in one move', () => {
            // Set up multiple mergeable pairs
            board.setCell(0, 0, 2);
            board.setCell(0, 1, 2);
            board.setCell(0, 2, 4);
            board.setCell(0, 3, 4);
            mockSelectRandom.mockClear();
            
            board.mergeLeft();
            
            expect(board.getCell(0, 0)).toBe(4);
            expect(board.getCell(0, 1)).toBe(8);
            expect(board.getCell(0, 2)).toBe(null);
            expect(board.getCell(0, 3)).toBe(null);
            expect(board.getScore()).toBe(12); // 4 + 8
        });

        it('should handle moving without merging', () => {
            board.setCell(0, 0, 2);
            board.setCell(0, 2, 4);
            mockSelectRandom.mockClear();
            
            board.mergeLeft();
            
            expect(board.getCell(0, 0)).toBe(2);
            expect(board.getCell(0, 1)).toBe(4);
            expect(board.getCell(0, 2)).toBe(null);
            expect(board.getScore()).toBe(0); // No merges
        });

        it('should handle gaps between mergeable cells', () => {
            board.setCell(0, 0, 2);
            board.setCell(0, 3, 2);
            mockSelectRandom.mockClear();
            
            board.mergeLeft();
            
            expect(board.getCell(0, 0)).toBe(4);
            expect(board.getCell(0, 1)).toBe(null);
            expect(board.getCell(0, 2)).toBe(null);
            expect(board.getCell(0, 3)).toBe(null);
            expect(board.getScore()).toBe(4);
        });
    });

    describe('AI integration', () => {
        it('should call AI helper with board state and history', async () => {
            mockAIHelper.suggestMove.mockResolvedValue(undefined);
            board.collectMoveHistory({ direction: 'up' });
            
            await board.suggestAIMove();
            
            expect(mockAIHelper.suggestMove).toHaveBeenCalledWith(
                expect.stringContaining('Current board state:')
            );
            expect(mockAIHelper.suggestMove).toHaveBeenCalledWith(
                expect.stringContaining('Move history:')
            );
        });

        it('should handle AI helper errors gracefully', async () => {
            const error = new Error('AI service unavailable');
            mockAIHelper.suggestMove.mockRejectedValue(error);
            
            // Should not throw error
            await expect(board.suggestAIMove()).rejects.toThrow('AI service unavailable');
        });
    });

    describe('edge cases and error handling', () => {
        it('should handle empty board display', () => {
            // Reset to completely empty board
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    board.setCell(row, col, null);
                }
            }
            
            expect(() => board.display()).not.toThrow();
            expect(mockLogger.info).toHaveBeenCalled();
        });

        it('should handle merging on empty board', () => {
            // Reset to completely empty board
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    board.setCell(row, col, null);
                }
            }
            // Mock insertRandomNumber for this test
            jest.spyOn(board, 'insertRandomNumber').mockImplementation(() => false);
            
            expect(() => board.mergeUp()).not.toThrow();
        });

        it('should handle large numbers in merging', () => {
            board.setCell(0, 0, 1024);
            board.setCell(0, 1, 1024);
            // Mock insertRandomNumber for this test
            jest.spyOn(board, 'insertRandomNumber').mockImplementation(() => false);
            
            board.mergeLeft();
            
            expect(board.getCell(0, 0)).toBe(2048);
            expect(board.getScore()).toBe(2048);
        });

        it('should maintain score across multiple operations', () => {
            // First merge
            board.setCell(0, 0, 2);
            board.setCell(0, 1, 2);
            mockSelectRandom.mockClear();
            board.mergeLeft();
            expect(board.getScore()).toBe(4);
            
            // Second merge
            board.setCell(1, 0, 4);
            board.setCell(1, 1, 4);
            mockSelectRandom.mockClear();
            board.mergeLeft();
            expect(board.getScore()).toBe(12); // 4 + 8
        });
    });

    describe('boundary conditions', () => {
        it('should handle single cell moves correctly', () => {
            // Place single cell and move
            board.setCell(3, 3, 2);
            mockSelectRandom.mockClear();
            
            board.mergeUp();
            
            expect(board.getCell(0, 3)).toBe(2);
            expect(board.getCell(3, 3)).toBe(null);
        });

        it('should handle no available moves in merge', () => {
            // Fill board with different values in checkered pattern
            board.setCell(0, 0, 2);
            board.setCell(0, 1, 4);
            board.setCell(0, 2, 2);
            board.setCell(0, 3, 4);
            mockSelectRandom.mockClear();
            
            board.mergeLeft();
            
            // Should only move, not merge
            expect(board.getCell(0, 0)).toBe(2);
            expect(board.getCell(0, 1)).toBe(4);
            expect(board.getCell(0, 2)).toBe(2);
            expect(board.getCell(0, 3)).toBe(4);
        });
    });

    describe('random number generation edge cases', () => {
        it('should handle different random loop counts', () => {
            mockMathRandom
                .mockReturnValueOnce(0.1) // Small value for loop count
                .mockReturnValueOnce(0.5); // For 2 vs 4 generation
            mockSelectRandom.mockClear();
            
            const result = board.insertRandomNumber();
            
            expect(result).toBe(true);
            expect(mockSelectRandom).toHaveBeenCalled();
        });

        it('should handle maximum random loop count', () => {
            mockMathRandom
                .mockReturnValueOnce(0.99) // Large value for loop count
                .mockReturnValueOnce(0.5); // For 2 vs 4 generation
            mockSelectRandom.mockClear();
            
            const result = board.insertRandomNumber();
            
            expect(result).toBe(true);
            expect(mockSelectRandom).toHaveBeenCalled();
        });
    });
});