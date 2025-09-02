import chalk from 'chalk';
import ora from 'ora';
import logger from '../utils/logger';
import { createReadlineInterface, question } from '../utils/readline';
import { Board } from '../board';
import { mainPrompt } from '../utils/prompt';

interface GameOptions {
    // Define any options that might be passed to the game command
    [key: string]: any;
}

const oraInstance = ora('Loading...');

const mainProgram = async (_quoptions: GameOptions) => {
    logger.info(chalk.green('Starting Game 2048...'));
    const spinner = oraInstance.start();
    console.log(); // Add a newline for better readability
    try {
        const board = new Board();
        //await board.getToken();
        spinner.stop();
        console.log(); // Add a newline for better readability
        logger.info(chalk.blue('Game 2048 Loaded!'));
        board.collectMoveHistory({ direction: 'start' });
        board.display();
        const rl = createReadlineInterface();
        
        // Game input loop
        let gameRunning = true;
        while (gameRunning) {
            try {
                mainPrompt(board.isGameOver());
                const input = await question(rl, '> ');
                const command = input.trim().toLowerCase();
                switch (command) {
                    case 'up':
                    case 'w':
                        board.mergeUp();
                        board.collectMoveHistory({ direction: 'up' });
                        board.display();
                        break;

                    case 'down':
                    case 's':
                        board.mergeDown();
                        board.collectMoveHistory({ direction: 'down' });
                        board.display();
                        break;

                    case 'left':
                    case 'a':
                        board.mergeLeft();
                        board.collectMoveHistory({ direction: 'left' });
                        board.display();
                        break;

                    case 'right':
                    case 'd':
                        board.mergeRight();
                        board.collectMoveHistory({ direction: 'right' });
                        board.display();
                        break;

                    case 'ai':
                    case 'ai-move':
                        try {
                            logger.info(chalk.yellow('Asking AI for move suggestion...'));
                            logger.info(chalk.yellow('Requesting AI for move suggestion...'));
                            await board.suggestAIMove();
                            logger.info(chalk.yellow('AI suggestion completed.'));
                            board.display();
                        } catch (aiError) {
                            logger.error('Error in AI suggestion:', aiError);
                        }
                        break;

                    case 'reset':
                    case 'r':
                        logger.info(chalk.cyan('Resetting game...'));
                        board.reset();
                        board.display();
                        break;

                    case 'display':
                    case 'show':
                        board.display();
                        break;

                    case 'quit':
                    case 'exit':
                    case 'q':
                        logger.info(chalk.red('Thanks for playing! Goodbye!'));
                        gameRunning = false;
                        break;

                    case 'help':
                    case 'h':
                        logger.info(chalk.blue('Available commands:'));
                        logger.info('  up/w         - Move up');
                        logger.info('  down/s       - Move down');
                        logger.info('  left/a       - Move left');
                        logger.info('  right/d      - Move right');
                        logger.info('  ai-move/ai   - ask AI for move');
                        logger.info('  reset/r      - Reset game');
                        logger.info('  display/show - Show board');
                        logger.info('  help/h       - Show this help');
                        logger.info('  quit/q       - Exit game');
                        break;
                    default:
                        logger.info(chalk.red(`Unknown command: "${command}". Type "help" for available commands.`));
                        console.log();
                        board.display();
                        break;
                }
                console.log();
                if (board.isGameOver() && ['quit', 'exit', 'q'].includes(command) === false) {
                    logger.info(chalk.yellow('Game Over! No more moves available.'));
                    logger.info(chalk.yellow(`Your final score: ${board.getScore()}`));
                    console.log();
                    logger.info(chalk.red('Please reset the game to play again or type "quit" to exit.'));
                    console.log();
                }
            } catch (inputError) {
                logger.error('Error reading input:', inputError);
                console.log();
                board.display();
                // Don't exit the loop, just continue to next iteration
                continue;
            }
        }
        // Close readline interface when game ends
        rl.close();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        spinner.fail(`Game2048 failed: ${errorMessage}`);
        logger.error('Game2048 error:', error);
        process.exit(1);
    }
}

export default mainProgram;