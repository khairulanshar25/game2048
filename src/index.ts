import { Command } from 'commander';
import logger from './utils/logger';
import mainProgram from './main-program';

const program = new Command();

program
    .version('1.0.0')
    .description('Game 2048 CLI Application');

program
    .command('Game2048')
    .description('Play the Game 2048')
    .action(mainProgram);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', { promise: promise.toString(), reason });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});


process.on('exit', (code) => {
    logger.debug(`Process is exiting with code: ${code}`);
});

process.on('SIGINT', () => {
    logger.debug('Received SIGINT (Ctrl+C)');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.debug('Received SIGTERM');
    process.exit(0);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

export default program;