import chalk from 'chalk';
import { getService, postService } from '../utils/services';
import envConfig from '../config/config';
import { getToken } from '../utils/token';
import logger from '../utils/logger';
import { GameMove } from '../board/interface';

export interface AIConfig {
    baselUrl?: string;
    apiKey?: string;
    timeout?: number;
}

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