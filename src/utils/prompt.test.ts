import { mainPrompt } from './prompt';
import logger from '../utils/logger';
import chalk from 'chalk';

// Mock dependencies
jest.mock('../utils/logger');
jest.mock('chalk', () => ({
    green: jest.fn((text: string) => `green(${text})`),
    cyan: jest.fn((text: string) => `cyan(${text})`),
    yellow: jest.fn((text: string) => `yellow(${text})`),
    red: jest.fn((text: string) => `red(${text})`),
    blue: jest.fn((text: string) => `blue(${text})`)
}));

describe('prompt utilities', () => {
    let mockLogger: jest.Mocked<typeof logger>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup logger mock
        mockLogger = logger as jest.Mocked<typeof logger>;
        mockLogger.info = jest.fn();
    });

    describe('mainPrompt', () => {
        it('should display all prompts when game is not over', () => {
            mainPrompt(false);

            expect(mockLogger.info).toHaveBeenCalledTimes(6);
            
            // Verify each prompt message is logged with correct colors
            expect(mockLogger.info).toHaveBeenNthCalledWith(1, 'green(Enter your move (type up or w, down or s, left or a, right or d).)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(2, 'green(Type reset or r to reset the game.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(3, 'cyan(Type ai-move or ai to ask AI for a move suggestion.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(4, 'yellow(Type help or h to display this help message.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(5, 'red(Type quit or q to exit.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(6, 'blue(Then press Enter to submit your command.)');
        });

        it('should display limited prompts when game is over', () => {
            mainPrompt(true);

            expect(mockLogger.info).toHaveBeenCalledTimes(3);
            
            // Should not display move-related prompts when game is over
            expect(mockLogger.info).not.toHaveBeenCalledWith('green(Enter your move (type up or w, down or s, left or a, right or d).)');
            expect(mockLogger.info).not.toHaveBeenCalledWith('cyan(Type ai-move or ai to ask AI for a move suggestion.)');
            expect(mockLogger.info).not.toHaveBeenCalledWith('yellow(Type help or h to display this help message.)');
            
            // Should still display reset, quit, and enter prompts
            expect(mockLogger.info).toHaveBeenNthCalledWith(1, 'green(Type reset or r to reset the game.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(2, 'red(Type quit or q to exit.)');
            expect(mockLogger.info).toHaveBeenNthCalledWith(3, 'blue(Then press Enter to submit your command.)');
        });

        it('should use correct chalk colors for each message type', () => {
            mainPrompt(false);

            // Verify chalk color methods are called with correct messages
            expect(chalk.green).toHaveBeenCalledWith('Enter your move (type up or w, down or s, left or a, right or d).');
            expect(chalk.green).toHaveBeenCalledWith('Type reset or r to reset the game.');
            expect(chalk.cyan).toHaveBeenCalledWith('Type ai-move or ai to ask AI for a move suggestion.');
            expect(chalk.yellow).toHaveBeenCalledWith('Type help or h to display this help message.');
            expect(chalk.red).toHaveBeenCalledWith('Type quit or q to exit.');
            expect(chalk.blue).toHaveBeenCalledWith('Then press Enter to submit your command.');
        });

        it('should handle game over state correctly', () => {
            mainPrompt(true);

            // Verify conditional messages are not shown
            expect(chalk.green).toHaveBeenCalledTimes(1); // Only reset message
            expect(chalk.cyan).not.toHaveBeenCalled(); // AI move suggestion not shown
            expect(chalk.yellow).not.toHaveBeenCalled(); // Help message not shown
            expect(chalk.red).toHaveBeenCalledTimes(1); // Quit message
            expect(chalk.blue).toHaveBeenCalledTimes(1); // Enter command message
        });

        it('should handle game active state correctly', () => {
            mainPrompt(false);

            // Verify all colors are used when game is active
            expect(chalk.green).toHaveBeenCalledTimes(2); // Move and reset messages
            expect(chalk.cyan).toHaveBeenCalledTimes(1); // AI move suggestion
            expect(chalk.yellow).toHaveBeenCalledTimes(1); // Help message
            expect(chalk.red).toHaveBeenCalledTimes(1); // Quit message
            expect(chalk.blue).toHaveBeenCalledTimes(1); // Enter command message
        });

        it('should call logger.info for each message', () => {
            const loggerSpy = jest.spyOn(mockLogger, 'info');
            
            mainPrompt(false);
            
            expect(loggerSpy).toHaveBeenCalledTimes(6);
            
            // Verify logger.info is called with colored strings
            loggerSpy.mock.calls.forEach(call => {
                expect(typeof call[0]).toBe('string');
                expect(call[0]).toMatch(/^(green|cyan|yellow|red|blue)\(.+\)$/);
            });
        });

        it('should maintain consistent message order', () => {
            mainPrompt(false);

            const calls = mockLogger.info.mock.calls.map(call => call[0]);
            
            // Verify the order of messages
            expect(calls[0]).toContain('Enter your move');
            expect(calls[1]).toContain('Type reset');
            expect(calls[2]).toContain('Type ai-move');
            expect(calls[3]).toContain('Type help');
            expect(calls[4]).toContain('Type quit');
            expect(calls[5]).toContain('Then press Enter');
        });

        it('should handle boolean parameter correctly', () => {
            // Test with explicit true
            mainPrompt(true);
            expect(mockLogger.info).toHaveBeenCalledTimes(3);

            jest.clearAllMocks();

            // Test with explicit false
            mainPrompt(false);
            expect(mockLogger.info).toHaveBeenCalledTimes(6);
        });

        it('should handle truthy and falsy values', () => {
            // Test with truthy value (should behave like true)
            mainPrompt(1 as any);
            expect(mockLogger.info).toHaveBeenCalledTimes(3);

            jest.clearAllMocks();

            // Test with falsy value (should behave like false)
            mainPrompt(0 as any);
            expect(mockLogger.info).toHaveBeenCalledTimes(6);

            jest.clearAllMocks();

            // Test with null (should behave like false)
            mainPrompt(null as any);
            expect(mockLogger.info).toHaveBeenCalledTimes(6);

            jest.clearAllMocks();

            // Test with undefined (should behave like false)
            mainPrompt(undefined as any);
            expect(mockLogger.info).toHaveBeenCalledTimes(6);
        });
    });
});