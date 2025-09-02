import AIHelper from './index';

// Mock dependencies
jest.mock('../utils/services');
jest.mock('../config/config');
jest.mock('../utils/logger');
jest.mock('chalk');

import { postService } from '../utils/services';
import envConfig from '../config/config';
import logger from '../utils/logger';
import chalk from 'chalk';

const mockPostService = postService as jest.MockedFunction<typeof postService>;
const mockLogger = logger as jest.Mocked<typeof logger>;

// Mock chalk properly
const mockChalk = {
    yellow: jest.fn((text: string) => `yellow(${text})`),
    green: jest.fn((text: string) => `green(${text})`)
};
(chalk as any).yellow = mockChalk.yellow;
(chalk as any).green = mockChalk.green;

// Mock envConfig
(envConfig as any).AI_URL = 'http://test-ai-url.com';
(envConfig as any).AI_MODEL = 'test-model';

// Mock console.log
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

// Mock AbortController
const mockAbort = jest.fn();
const mockController = {
    abort: mockAbort,
    signal: { aborted: false }
};
global.AbortController = jest.fn().mockImplementation(() => mockController);

describe('AIHelper', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockChalk.yellow.mockImplementation((text: string) => `yellow(${text})`);
        mockChalk.green.mockImplementation((text: string) => `green(${text})`);
        consoleSpy.mockClear();
        mockAbort.mockClear();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    describe('constructor', () => {
        it('should create instance with default config when no config provided', () => {
            const aiHelper = new AIHelper();
            
            expect(aiHelper['config']).toEqual({
                baselUrl: 'http://test-ai-url.com',
                timeout: 5000
            });
        });

        it('should merge provided config with defaults', () => {
            const customConfig = {
                baselUrl: 'http://custom-url.com',
                timeout: 10000
            };
            
            const aiHelper = new AIHelper(customConfig);
            
            expect(aiHelper['config']).toEqual({
                baselUrl: 'http://custom-url.com',
                timeout: 10000
            });
        });

        it('should override only provided config properties', () => {
            const partialConfig = {
                timeout: 15000
            };
            
            const aiHelper = new AIHelper(partialConfig);
            
            expect(aiHelper['config']).toEqual({
                baselUrl: 'http://test-ai-url.com',
                timeout: 15000
            });
        });

        it('should handle additional custom properties via spread operator', () => {
            const customConfig = {
                baselUrl: 'http://custom-url.com',
                timeout: 8000,
                apiKey: 'secret-key',
                retries: 3
            };
            
            const aiHelper = new AIHelper(customConfig);
            
            expect(aiHelper['config']).toEqual({
                baselUrl: 'http://custom-url.com',
                timeout: 8000,
                apiKey: 'secret-key',
                retries: 3
            });
        });

        it('should handle empty object config', () => {
            const aiHelper = new AIHelper({});
            
            expect(aiHelper['config']).toEqual({
                baselUrl: 'http://test-ai-url.com',
                timeout: 5000
            });
        });
    });

    describe('suggestMove', () => {
        it('should abort previous request before making new one', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            // Make first request to set up controller
            await aiHelper.suggestMove('first question');
            
            // Reset the abort mock and create a new one for second call
            mockAbort.mockClear();
            
            // Make second request - this should abort the first
            await aiHelper.suggestMove('second question');

            // The abort should have been called when the second request started
            expect(mockAbort).toHaveBeenCalled();
        });

        it('should create new AbortController for each request', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(global.AbortController).toHaveBeenCalled();
        });

        it('should log debug payload with correct format', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Payload:', {
                question: 'test question',
                model: 'test-model'
            });
        });

        it('should make API call with correct parameters', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper({
                baselUrl: 'http://custom-api.com',
                timeout: 10000
            });
            
            await aiHelper.suggestMove('test question');

            expect(mockPostService).toHaveBeenCalledWith(
                'http://custom-api.com/api/fabric/v1/ai/suggest-move',
                { question: 'test question', model: 'test-model' },
                { signal: mockController.signal }
            );
        });

        it('should handle successful response with message data', async () => {
            const mockResponse = {
                data: {
                    data: {
                        message: 'AI suggests moving left'
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            // Verify console.log calls (empty lines)
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            expect(consoleSpy).toHaveBeenNthCalledWith(1);
            expect(consoleSpy).toHaveBeenNthCalledWith(2);

            // Verify logger calls
            expect(mockLogger.info).toHaveBeenCalledWith('yellow(AI Suggest Move Response:\n)');
            expect(mockLogger.info).toHaveBeenCalledWith('green(AI suggests moving left)');
        });

        it('should handle response with nested data structure', async () => {
            const mockResponse = {
                data: {
                    data: {
                        message: 'Complex response with multiple lines\nand formatting'
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('complex question');

            expect(mockLogger.info).toHaveBeenCalledWith('green(Complex response with multiple lines\nand formatting)');
        });

        it('should handle response without data property', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
            expect(mockLogger.info).not.toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it('should handle response with data but no nested data property', async () => {
            const mockResponse = {
                data: {
                    someOtherProperty: 'value'
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle response with data.data but no message', async () => {
            const mockResponse = {
                data: {
                    data: {
                        someOtherField: 'value'
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle response with empty message', async () => {
            const mockResponse = {
                data: {
                    data: {
                        message: ''
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle null/undefined response data', async () => {
            const mockResponse = {
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network timeout');
            mockPostService.mockRejectedValue(networkError);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.error).toHaveBeenCalledWith('Failed to get AI suggestion:', networkError);
        });

        it('should handle API errors', async () => {
            const apiError = new Error('API returned 500');
            mockPostService.mockRejectedValue(apiError);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.error).toHaveBeenCalledWith('Failed to get AI suggestion:', apiError);
        });

        it('should handle abort errors', async () => {
            const abortError = new Error('Request aborted');
            abortError.name = 'AbortError';
            mockPostService.mockRejectedValue(abortError);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.error).toHaveBeenCalledWith('Failed to get AI suggestion:', abortError);
        });

        it('should handle empty question string', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('');

            expect(mockPostService).toHaveBeenCalledWith(
                'http://test-ai-url.com/api/fabric/v1/ai/suggest-move',
                { question: '', model: 'test-model' },
                { signal: mockController.signal }
            );
        });

        it('should handle special characters in question', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            const specialQuestion = 'What about moves with symbols: @#$%^&*()';
            
            await aiHelper.suggestMove(specialQuestion);

            expect(mockPostService).toHaveBeenCalledWith(
                'http://test-ai-url.com/api/fabric/v1/ai/suggest-move',
                { question: specialQuestion, model: 'test-model' },
                { signal: mockController.signal }
            );
        });

        it('should handle very long question strings', async () => {
            const mockResponse = {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(mockResponse);

            const aiHelper = new AIHelper();
            const longQuestion = 'A'.repeat(10000);
            
            await aiHelper.suggestMove(longQuestion);

            expect(mockPostService).toHaveBeenCalledWith(
                'http://test-ai-url.com/api/fabric/v1/ai/suggest-move',
                { question: longQuestion, model: 'test-model' },
                { signal: mockController.signal }
            );
        });
    });

    describe('edge cases and error scenarios', () => {
        it('should handle postService returning undefined', async () => {
            mockPostService.mockResolvedValue(undefined as any);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle malformed response structure', async () => {
            const malformedResponse = {
                notData: 'unexpected structure',
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {} as any
            };
            mockPostService.mockResolvedValue(malformedResponse as any);

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.debug).toHaveBeenCalledWith('AI Suggest Move Response received but no data found');
        });

        it('should handle AbortController creation failure', async () => {
            global.AbortController = jest.fn().mockImplementation(() => {
                throw new Error('AbortController not supported');
            });

            const aiHelper = new AIHelper();
            
            await aiHelper.suggestMove('test question');

            expect(mockLogger.error).toHaveBeenCalledWith('Failed to get AI suggestion:', expect.any(Error));
        });
    });
});
