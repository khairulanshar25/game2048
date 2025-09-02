// Mock all dependencies before imports
jest.mock('chalk', () => ({
    green: jest.fn((text: string) => `green(${text})`),
    blue: jest.fn((text: string) => `blue(${text})`),
    yellow: jest.fn((text: string) => `yellow(${text})`),
    cyan: jest.fn((text: string) => `cyan(${text})`),
    red: jest.fn((text: string) => `red(${text})`)
}));

jest.mock('ora', () => {
    const mockSpinner = {
        start: jest.fn().mockReturnThis(),
        stop: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis()
    };
    return jest.fn(() => mockSpinner);
});

jest.mock('../utils/logger');
jest.mock('../utils/readline');
jest.mock('../board');
jest.mock('../utils/prompt');

import mainProgram from './index';
import chalk from 'chalk';
import ora from 'ora';
import logger from '../utils/logger';
import { createReadlineInterface, question } from '../utils/readline';
import { Board } from '../board';
import { mainPrompt } from '../utils/prompt';

// Get the mocked instances
const mockChalk = chalk as jest.Mocked<typeof chalk>;
const mockOra = ora as jest.MockedFunction<typeof ora>;
const mockLogger = logger as jest.Mocked<typeof logger>;
const mockCreateReadlineInterface = createReadlineInterface as jest.MockedFunction<typeof createReadlineInterface>;
const mockQuestion = question as jest.MockedFunction<typeof question>;
const mockMainPrompt = mainPrompt as jest.MockedFunction<typeof mainPrompt>;

const mockBoard = {
    collectMoveHistory: jest.fn(),
    display: jest.fn(),
    isGameOver: jest.fn(),
    mergeUp: jest.fn(),
    mergeDown: jest.fn(),
    mergeLeft: jest.fn(),
    mergeRight: jest.fn(),
    suggestAIMove: jest.fn(),
    reset: jest.fn(),
    getScore: jest.fn()
};

const mockRl = {
    close: jest.fn()
};

const mockSpinner = {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis()
};

(Board as jest.MockedClass<typeof Board>).mockImplementation(() => mockBoard as any);

// Mock console.log
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

// Mock process.exit
const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('Process exit called');
});

describe('mainProgram', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockClear();
        processExitSpy.mockClear();
        
        // Setup default mocks
        mockCreateReadlineInterface.mockReturnValue(mockRl as any);
        mockOra.mockReturnValue(mockSpinner as any);
        mockBoard.isGameOver.mockReturnValue(false);
        mockBoard.getScore.mockReturnValue(1024);
        mockQuestion.mockResolvedValue('quit'); // Default to quit to end loops
    });

    afterAll(() => {
        consoleSpy.mockRestore();
        processExitSpy.mockRestore();
    });

    describe('successful game initialization', () => {
        it('should start game successfully and handle quit command', async () => {
            mockQuestion.mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('green(Starting Game 2048...)');
            expect(mockLogger.info).toHaveBeenCalledWith('blue(Game 2048 Loaded!)');
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'start' });
            expect(mockBoard.display).toHaveBeenCalled();
            expect(mockCreateReadlineInterface).toHaveBeenCalled();
            expect(mockMainPrompt).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('red(Thanks for playing! Goodbye!)');
            expect(mockRl.close).toHaveBeenCalled();
        });

        it('should handle exit command', async () => {
            mockQuestion.mockResolvedValueOnce('exit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('red(Thanks for playing! Goodbye!)');
            expect(mockRl.close).toHaveBeenCalled();
        });

        it('should handle q command', async () => {
            mockQuestion.mockResolvedValueOnce('q');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('red(Thanks for playing! Goodbye!)');
            expect(mockRl.close).toHaveBeenCalled();
        });
    });

    describe('movement commands', () => {
        it('should handle up command', async () => {
            mockQuestion
                .mockResolvedValueOnce('up')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeUp).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'up' });
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle w command (alternative up)', async () => {
            mockQuestion
                .mockResolvedValueOnce('w')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeUp).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'up' });
        });

        it('should handle down command', async () => {
            mockQuestion
                .mockResolvedValueOnce('down')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeDown).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'down' });
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle s command (alternative down)', async () => {
            mockQuestion
                .mockResolvedValueOnce('s')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeDown).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'down' });
        });

        it('should handle left command', async () => {
            mockQuestion
                .mockResolvedValueOnce('left')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeLeft).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'left' });
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle a command (alternative left)', async () => {
            mockQuestion
                .mockResolvedValueOnce('a')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeLeft).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'left' });
        });

        it('should handle right command', async () => {
            mockQuestion
                .mockResolvedValueOnce('right')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeRight).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'right' });
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle d command (alternative right)', async () => {
            mockQuestion
                .mockResolvedValueOnce('d')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.mergeRight).toHaveBeenCalled();
            expect(mockBoard.collectMoveHistory).toHaveBeenCalledWith({ direction: 'right' });
        });
    });

    describe('AI commands', () => {
        it('should handle ai command successfully', async () => {
            mockBoard.suggestAIMove.mockResolvedValueOnce(undefined);
            mockQuestion
                .mockResolvedValueOnce('ai')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('yellow(Asking AI for move suggestion...)');
            expect(mockLogger.info).toHaveBeenCalledWith('yellow(Requesting AI for move suggestion...)');
            expect(mockBoard.suggestAIMove).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('yellow(AI suggestion completed.)');
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle ai-move command successfully', async () => {
            mockBoard.suggestAIMove.mockResolvedValueOnce(undefined);
            mockQuestion
                .mockResolvedValueOnce('ai-move')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('yellow(Asking AI for move suggestion...)');
            expect(mockBoard.suggestAIMove).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('yellow(AI suggestion completed.)');
        });

        it('should handle AI error gracefully', async () => {
            const aiError = new Error('AI service unavailable');
            mockBoard.suggestAIMove.mockRejectedValueOnce(aiError);
            mockQuestion
                .mockResolvedValueOnce('ai')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.error).toHaveBeenCalledWith('Error in AI suggestion:', aiError);
            expect(mockBoard.display).toHaveBeenCalled();
        });
    });

    describe('game management commands', () => {
        it('should handle reset command', async () => {
            mockQuestion
                .mockResolvedValueOnce('reset')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('cyan(Resetting game...)');
            expect(mockBoard.reset).toHaveBeenCalled();
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle r command (alternative reset)', async () => {
            mockQuestion
                .mockResolvedValueOnce('r')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('cyan(Resetting game...)');
            expect(mockBoard.reset).toHaveBeenCalled();
        });

        it('should handle display command', async () => {
            mockQuestion
                .mockResolvedValueOnce('display')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle show command (alternative display)', async () => {
            mockQuestion
                .mockResolvedValueOnce('show')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockBoard.display).toHaveBeenCalled();
        });
    });

    describe('help command', () => {
        it('should handle help command', async () => {
            mockQuestion
                .mockResolvedValueOnce('help')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('blue(Available commands:)');
            expect(mockLogger.info).toHaveBeenCalledWith('  up/w         - Move up');
            expect(mockLogger.info).toHaveBeenCalledWith('  down/s       - Move down');
            expect(mockLogger.info).toHaveBeenCalledWith('  left/a       - Move left');
            expect(mockLogger.info).toHaveBeenCalledWith('  right/d      - Move right');
            expect(mockLogger.info).toHaveBeenCalledWith('  ai-move/ai   - ask AI for move');
            expect(mockLogger.info).toHaveBeenCalledWith('  reset/r      - Reset game');
            expect(mockLogger.info).toHaveBeenCalledWith('  display/show - Show board');
            expect(mockLogger.info).toHaveBeenCalledWith('  help/h       - Show this help');
            expect(mockLogger.info).toHaveBeenCalledWith('  quit/q       - Exit game');
        });

        it('should handle h command (alternative help)', async () => {
            mockQuestion
                .mockResolvedValueOnce('h')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('blue(Available commands:)');
        });
    });

    describe('unknown commands', () => {
        it('should handle unknown command', async () => {
            mockQuestion
                .mockResolvedValueOnce('unknown')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('red(Unknown command: "unknown". Type "help" for available commands.)');
            expect(consoleSpy).toHaveBeenCalled();
            expect(mockBoard.display).toHaveBeenCalled();
        });

        it('should handle empty command', async () => {
            mockQuestion
                .mockResolvedValueOnce('')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('red(Unknown command: "". Type "help" for available commands.)');
        });

        it('should handle command with whitespace', async () => {
            mockQuestion
                .mockResolvedValueOnce('  invalid  ')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('red(Unknown command: "invalid". Type "help" for available commands.)');
        });
    });

    describe('game over scenarios', () => {
        it('should display game over message when game is over and not quitting', async () => {
            mockBoard.isGameOver.mockReturnValue(true);
            mockBoard.getScore.mockReturnValue(2048);
            mockQuestion
                .mockResolvedValueOnce('up')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('yellow(Game Over! No more moves available.)');
            expect(mockLogger.info).toHaveBeenCalledWith('yellow(Your final score: 2048)');
            expect(mockLogger.info).toHaveBeenCalledWith('red(Please reset the game to play again or type "quit" to exit.)');
        });

        it('should not display game over message when quitting', async () => {
            mockBoard.isGameOver.mockReturnValue(true);
            mockQuestion.mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).not.toHaveBeenCalledWith('yellow(Game Over! No more moves available.)');
        });

        it('should not display game over message when exiting', async () => {
            mockBoard.isGameOver.mockReturnValue(true);
            mockQuestion.mockResolvedValueOnce('exit');

            await mainProgram({});

            expect(mockLogger.info).not.toHaveBeenCalledWith('yellow(Game Over! No more moves available.)');
        });

        it('should not display game over message when using q command', async () => {
            mockBoard.isGameOver.mockReturnValue(true);
            mockQuestion.mockResolvedValueOnce('q');

            await mainProgram({});

            expect(mockLogger.info).not.toHaveBeenCalledWith('yellow(Game Over! No more moves available.)');
        });
    });

    describe('input error handling', () => {
        it('should handle input reading errors and continue game', async () => {
            const inputError = new Error('Input read error');
            mockQuestion
                .mockRejectedValueOnce(inputError)
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.error).toHaveBeenCalledWith('Error reading input:', inputError);
            expect(consoleSpy).toHaveBeenCalled();
            expect(mockBoard.display).toHaveBeenCalled();
            // Game should continue and eventually quit
            expect(mockRl.close).toHaveBeenCalled();
        });

        it('should handle multiple input errors', async () => {
            const inputError1 = new Error('First input error');
            const inputError2 = new Error('Second input error');
            mockQuestion
                .mockRejectedValueOnce(inputError1)
                .mockRejectedValueOnce(inputError2)
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.error).toHaveBeenCalledWith('Error reading input:', inputError1);
            expect(mockLogger.error).toHaveBeenCalledWith('Error reading input:', inputError2);
            expect(mockRl.close).toHaveBeenCalled();
        });
    });

    describe('game initialization errors', () => {
        it('should handle Board constructor error', async () => {
            const boardError = new Error('Board initialization failed');
            (Board as jest.MockedClass<typeof Board>).mockImplementationOnce(() => {
                throw boardError;
            });

            try {
                await mainProgram({});
            } catch (error) {
                // Expect process.exit to be called
            }

            expect(mockLogger.error).toHaveBeenCalledWith('Game2048 error:', boardError);
            expect(processExitSpy).toHaveBeenCalledWith(1);
        });

        it('should handle non-Error exceptions', async () => {
            const nonErrorException = 'String error';
            (Board as jest.MockedClass<typeof Board>).mockImplementationOnce(() => {
                throw nonErrorException;
            });

            try {
                await mainProgram({});
            } catch (error) {
                // Expect process.exit to be called
            }

            expect(mockLogger.error).toHaveBeenCalledWith('Game2048 error:', nonErrorException);
            expect(processExitSpy).toHaveBeenCalledWith(1);
        });

        it('should handle readline interface creation error', async () => {
            const readlineError = new Error('Readline creation failed');
            mockCreateReadlineInterface.mockImplementationOnce(() => {
                throw readlineError;
            });

            try {
                await mainProgram({});
            } catch (error) {
                // Expect process.exit to be called
            }

            expect(mockLogger.error).toHaveBeenCalledWith('Game2048 error:', readlineError);
            expect(processExitSpy).toHaveBeenCalledWith(1);
        });
    });

    describe('console output', () => {
        it('should add newlines for readability', async () => {
            mockQuestion.mockResolvedValueOnce('quit');

            await mainProgram({});

            // Verify console.log calls for spacing
            expect(consoleSpy).toHaveBeenCalled();
        });

        it('should add newlines after commands', async () => {
            mockQuestion
                .mockResolvedValueOnce('display')
                .mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('options parameter', () => {
        it('should accept empty options object', async () => {
            mockQuestion.mockResolvedValueOnce('quit');

            await mainProgram({});

            expect(mockLogger.info).toHaveBeenCalledWith('green(Starting Game 2048...)');
        });

        it('should accept options with properties', async () => {
            mockQuestion.mockResolvedValueOnce('quit');

            await mainProgram({ debug: true, level: 1 });

            expect(mockLogger.info).toHaveBeenCalledWith('green(Starting Game 2048...)');
        });
    });
});