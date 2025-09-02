import * as readline from 'readline';
import { createReadlineInterface, question } from './readline';

describe('readline utility', () => {
    let mockRl: readline.Interface;

    beforeEach(() => {
        mockRl = {
            question: jest.fn(),
            close: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            setPrompt: jest.fn(),
            prompt: jest.fn(),
            write: jest.fn(),
            on: jest.fn(),
            removeListener: jest.fn(),
            removeAllListeners: jest.fn(),
            getPrompt: jest.fn(),
            [Symbol.asyncIterator]: jest.fn(),
        } as unknown as readline.Interface;
    });

    describe('createReadlineInterface', () => {
        it('should create a singleton readline interface', () => {
            const rl1 = createReadlineInterface();
            const rl2 = createReadlineInterface();
            expect(rl1).toBe(rl2);
            expect(rl1).toBeDefined();
        });
    });

    describe('question', () => {
        it('should resolve with trimmed answer', async () => {
            const answer = '  test answer  ';
            (mockRl.question as jest.Mock).mockImplementation((prompt, cb) => cb(answer));
            const result = await question(mockRl, 'Enter something: ');
            expect(result).toBe('test answer');
            expect(mockRl.question).toHaveBeenCalledWith('Enter something: ', expect.any(Function));
        });

        it('should handle empty input', async () => {
            (mockRl.question as jest.Mock).mockImplementation((prompt, cb) => cb('   '));
            const result = await question(mockRl, 'Prompt: ');
            expect(result).toBe('');
        });
    });
});