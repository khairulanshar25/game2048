import 'dotenv/config';

export interface EnvConfig {
    NODE_ENV: string;
    AI_URL: string;
    AI_MODEL: string;
    LOG_LEVEL: string;
    LOG_TO_FILE: boolean;
    LOG_FILE_PATH: string;
}

const envConfig: EnvConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    AI_URL: process.env.AI_URL || 'http://localhost:11434',
    AI_MODEL: process.env.AI_MODEL || 'llama3.2:3b-instruct-q8_0',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_TO_FILE: process.env.LOG_TO_FILE === 'true',
    LOG_FILE_PATH: process.env.LOG_FILE_PATH || 'logs/app.log',
};

export default envConfig;
