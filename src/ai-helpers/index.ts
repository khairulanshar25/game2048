import chalk from 'chalk';
import { postService } from '../utils/services';
import envConfig from '../config/config';
import logger from '../utils/logger';
import { AIConfig } from './interface'

const AI_API_ENDPOINT = {
    SUGGEST_MOVE: '/api/fabric/v1/ai/suggest-move'
};

const controller: any = {
    suggestMove: undefined,
}

export class AIHelper {
    private config: AIConfig;

    constructor(config: AIConfig = {}) {
        this.config = {
            baselUrl: config.baselUrl || envConfig.AI_URL,
            timeout: config.timeout || 5000,
            ...config
        };
    }

    public async suggestMove(question: string): Promise<void> {
        try {
            if (controller.suggestMove) {
                controller?.suggestMove?.abort()
            }
            controller.suggestMove = new AbortController()
            const payload = { question, model: envConfig.AI_MODEL };
            logger.debug('AI Suggest Move Payload:', payload);
            const response = await postService(
                `${this.config.baselUrl}${AI_API_ENDPOINT.SUGGEST_MOVE}`,
                { question, model: envConfig.AI_MODEL },
                { signal: controller?.suggestMove?.signal }
            );
            if (response?.data?.data?.message) {
                console.log();
                logger.info(chalk.yellow('AI Suggest Move Response:\n'));
                logger.info(chalk.green(response?.data?.data?.message));
                console.log();
            } else {
                logger.debug('AI Suggest Move Response received but no data found');
            }
        } catch (error) {
            logger.error('Failed to get AI suggestion:', error);
        }
    }
}

export default AIHelper;