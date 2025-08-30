import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import envConfig from '../config/config';

export type LogLevel = 'error' | 'warn' | 'info' | 'success' | 'debug';

export interface LoggerOptions {
    level?: LogLevel;
    logToFile?: boolean;
    logFile?: string;
}

export interface LogLevels {
    [key: string]: number;
}

export interface LogColors {
    [key: string]: chalk.Chalk;
}

export class Logger {
    public level: LogLevel;
    public logToFile: boolean;
    public logFile: string;
    private colors: LogColors;
    private levels: LogLevels;

    constructor(options: LoggerOptions = {}) {
        this.level = options.level || 'info';
        this.logToFile = options.logToFile || false;
        this.logFile = options.logFile || './logs/app.log';
        this.colors = {
            error: chalk.red,
            warn: chalk.yellow,
            info: chalk.blue,
            success: chalk.green,
            debug: chalk.gray
        };

        // Define log level hierarchy
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            success: 3,
            debug: 4
        };

        if (this.logToFile) {
            fs.ensureDirSync(path.dirname(this.logFile));
        }
    }

    private safeStringify(obj: any): string {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, val) => {
            if (val != null && typeof val === 'object') {
                if (seen.has(val)) {
                    return '[Circular]';
                }
                seen.add(val);
            }
            return val;
        }, 2);
    }

    shouldLog(level: LogLevel): boolean {
        const currentLevelValue = this.levels[this.level] || 2; // Default to info
        const messageLevelValue = this.levels[level] || 2;
        return messageLevelValue <= currentLevelValue;
    }

    log(level: LogLevel, message: string, data: any = null): void {
        if (!this.shouldLog(level)) {
            return; // Skip logging if level is below threshold
        }

        const timestamp = new Date().toISOString();
        const coloredLevel = this.colors[level] ? this.colors[level](level.toUpperCase()) : level.toUpperCase();

        let logMessage = `[${timestamp}] ${coloredLevel}: ${message}`;

        if (data) {
            if (typeof data === 'object') {
                try {
                    logMessage += '\n' + this.safeStringify(data);
                } catch (error) {
                    logMessage += '\n[Object - Unable to serialize]';
                }
            } else {
                logMessage += ` ${data}`;
            }
        }

        console.log(logMessage);

        if (this.logToFile) {
            let fileData = '';
            if (data) {
                if (typeof data === 'object') {
                    try {
                        fileData = '\n' + this.safeStringify(data);
                    } catch (error) {
                        fileData = '\n[Object - Unable to serialize]';
                    }
                } else {
                    fileData = ` ${data}`;
                }
            }
            const fileMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}${fileData}`;
            fs.appendFileSync(this.logFile, fileMessage + '\n');
        }
    }

    error(message: string, data?: any): void {
        this.log('error', message, data);
    }

    warn(message: string, data?: any): void {
        this.log('warn', message, data);
    }

    info(message: string, data?: any): void {
        this.log('info', message, data);
    }

    success(message: string, data?: any): void {
        this.log('success', message, data);
    }

    debug(message: string, data?: any): void {
        this.log('debug', message, data);
    }
}

export function createLogger(): Logger {
    return new Logger({
        level: envConfig.LOG_LEVEL as LogLevel,
        logToFile: envConfig.LOG_TO_FILE,
        logFile: envConfig.LOG_FILE_PATH
    });
}

// Create a logger instance
const logger = createLogger();

export default logger;
