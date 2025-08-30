import chalk from 'chalk';
import logger from '../utils/logger';

export const mainPrompt = (isGameOver: boolean) => {
    !isGameOver && logger.info(chalk.green('Enter your move (type up or w, down or s, left or a, right or d).'));
    logger.info(chalk.green('Type reset or r to reset the game.'));
    !isGameOver && logger.info(chalk.cyan('Type ai-move or ai to ask AI for a move suggestion.'));
    !isGameOver && logger.info(chalk.yellow('Type help or h to display this help message.'));
    logger.info(chalk.red('Type quit or q to exit.'));
    logger.info(chalk.blue('Then press Enter to submit your command.'));
}