import * as readline from 'readline';

let rl: readline.Interface | undefined;

/**
 * Creates and returns a singleton instance of the readline interface.
 * If the interface does not exist, it initializes a new one using
 * the standard input and output streams.
 *
 * @returns {readline.Interface} The readline interface instance.
 */
export function createReadlineInterface(): readline.Interface {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return rl;
}

/**
 * Prompts the user with a question using the provided readline interface and returns the trimmed answer as a Promise.
 *
 * @param rl - The readline interface to use for prompting the user.
 * @param prompt - The question or prompt to display to the user.
 * @returns A Promise that resolves to the user's trimmed input string.
 */
export function question(rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer: string) => {
            resolve(answer.trim());
        });
    });
}
