import { EnvConfig } from './config';

describe('envConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
        // Clear the specific env vars we want to test defaults for
        delete process.env.NODE_ENV;
        delete process.env.AI_URL;
        delete process.env.AI_MODEL;
        delete process.env.LOG_LEVEL;
        delete process.env.LOG_TO_FILE;
        delete process.env.LOG_FILE_PATH;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use default values when environment variables are not set', async () => {
        // Mock dotenv to not load .env file for this test
        jest.doMock('dotenv/config', () => ({}));
        
        const envConfig = (await import('./config')).default;

        expect(envConfig.NODE_ENV).toBe('development');
        expect(envConfig.AI_URL).toBe('http://localhost:11434');
        expect(envConfig.AI_MODEL).toBe('llama3.2:3b-instruct-q8_0');
        expect(envConfig.LOG_LEVEL).toBe('info');
        expect(envConfig.LOG_TO_FILE).toBe(false);
        expect(envConfig.LOG_FILE_PATH).toBe('logs/app.log');
    });

    it('should use environment variables when they are set', async () => {
        process.env.NODE_ENV = 'production';
        process.env.AI_URL = 'http://api.example.com';
        process.env.AI_MODEL = 'custom-model';
        process.env.LOG_LEVEL = 'debug';
        process.env.LOG_TO_FILE = 'true';
        process.env.LOG_FILE_PATH = 'custom/path/app.log';

        const envConfig = (await import('./config')).default;

        expect(envConfig.NODE_ENV).toBe('production');
        expect(envConfig.AI_URL).toBe('http://api.example.com');
        expect(envConfig.AI_MODEL).toBe('custom-model');
        expect(envConfig.LOG_LEVEL).toBe('debug');
        expect(envConfig.LOG_TO_FILE).toBe(true);
        expect(envConfig.LOG_FILE_PATH).toBe('custom/path/app.log');
    });

    it('should set LOG_TO_FILE to false when env var is not "true"', async () => {
        process.env.LOG_TO_FILE = 'false';
        let envConfig = (await import('./config')).default;
        expect(envConfig.LOG_TO_FILE).toBe(false);

        jest.resetModules();
        process.env.LOG_TO_FILE = 'yes';
        envConfig = (await import('./config')).default;
        expect(envConfig.LOG_TO_FILE).toBe(false);

        jest.resetModules();
        process.env.LOG_TO_FILE = '';
        envConfig = (await import('./config')).default;
        expect(envConfig.LOG_TO_FILE).toBe(false);
    });

    it('should export EnvConfig interface', async () => {
        const envConfig = (await import('./config')).default;
        expect(typeof envConfig).toBe('object');
        expect(envConfig).toHaveProperty('NODE_ENV');
        expect(envConfig).toHaveProperty('AI_URL');
        expect(envConfig).toHaveProperty('AI_MODEL');
        expect(envConfig).toHaveProperty('LOG_LEVEL');
        expect(envConfig).toHaveProperty('LOG_TO_FILE');
        expect(envConfig).toHaveProperty('LOG_FILE_PATH');
    });
});