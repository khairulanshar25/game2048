import logger from '../utils/logger';
import { formatCell } from '../utils/string';
import { selectRandom } from '../utils/array';
import CustomSet from '../utils/CustomSet';
import { AIHelper } from '../ai-helpers';
import chalk from 'chalk';
import { BoardRow, CellValue, GameBoard, GameMove } from './interface';



export class Board {
    private board: GameBoard;
    private readonly size: number = 4;
    private availableCells: CustomSet = new CustomSet();
    private aiHelper: AIHelper;
    private moveHistory: GameMove[] = [];
    private score: number = 0;

    constructor() {
        this.aiHelper = new AIHelper();
        this.board = this.createEmptyBoard();
        this.insertRandomNumber();
    }
    private createEmptyBoard(): GameBoard {
        this.availableCells.clear();
        return Array.from({ length: this.size }, (_, i): BoardRow =>
            Array.from({ length: this.size }, (_, j): CellValue => {
                this.availableCells.add([i, j]);
                return null;
            })
        );
    }
    public getBoard(): GameBoard {
        return this.board;
    }
    public getScore(): number {
        return this.score;
    }
    public getCell(row: number, col: number): CellValue {
        if (this.isValidPosition(row, col)) {
            return this.board[row][col];
        } else {
            throw new Error(`getCell Invalid position: (${row}, ${col})`);
        }
    }
    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }
    public reset(): void {
        this.board = this.createEmptyBoard();
        this.insertRandomNumber();
    }
    public display(): void {
        logger.info(`Current Score: ${this.score}`);
        logger.info('Current Board:');
        this.board.forEach((row: BoardRow, index: number) => {
            logger.info(`Row ${index}: [${row.map(cell => formatCell(cell)).join(', ')}]`);
        });
    }
    public insertRandomNumber(): boolean {
        const randomLoop = Math.floor(Math.random() * this.availableCells.size / 2) + 2;
        for (let i = 0; i < randomLoop; i++) {
            this.insertRandomNumberOnce();
        }
        return true;
    }
    public insertRandomNumberOnce(): boolean {
        const randomValue = Math.random() < 0.9 ? 2 : 4;
        this.insertNumberAtRandomPosition(randomValue);
        return true;
    }
    public insertNumberAtRandomPosition(value: number): boolean {
        if (this.isFull()) {
            return false; // Board is full, cannot insert
        }
        // Select a random cell from available cells
        const selectedCell = selectRandom(this.availableCells.values());
        if (!selectedCell) {
            return false; // Should not happen, but safety check
        }
        // Insert the specified number
        this.setCell(selectedCell.row, selectedCell.col, value);
        return true;
    }
    public setCell(row: number, col: number, value: CellValue): void {
        if (this.isValidPosition(row, col)) {
            const oldValue = this.board[row][col];
            this.board[row][col] = value;

            const cellKey: [number, number] = [row, col];

            // Update available cells set
            if (oldValue === null && value !== null) {
                this.availableCells.delete(cellKey);
            } else if (oldValue !== null && value === null) {
                this.availableCells.add(cellKey);
            }
        } else {
            throw new Error(`setCell Invalid position: (${row}, ${col})`);
        }
    }
    public isFull(): boolean {
        return this.availableCells.size === 0; // O(1) check using Set size
    }
    private convertBoardToString(board: GameBoard): string {
        let gameboardAsString = "";
        board.forEach((row: BoardRow, index: number) => {
            gameboardAsString += `Row ${index}: [${row.map(cell => formatCell(cell)).join(', ')}];\n`;
        });
        return gameboardAsString;
    }
    public collectMoveHistory(move: GameMove): GameMove[] {
        this.moveHistory.push({ ...move, score: this.score, gameBoard: this.board });
        logger.debug(chalk.yellow(`Moving ${move.direction}...`), this.getMoveHistory());
        return this.moveHistory;
    }
    public getMoveHistory(): GameMove[] {
        return this.moveHistory;
    }
    public getMoveHistoryString(): string {
        return this.moveHistory.map(move => {
            return `Direction: ${move.direction}, Score: ${move.score}, Board: ${this.convertBoardToString(move.gameBoard!)}`;
        }).join('\n');
    }
    public isGameOver(): boolean {
        if (!this.isFull()) {
            return false;
        }
        // Check for possible merges in all directions
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cellValue = this.board[row][col];

                // Check right neighbor
                if (col < this.size - 1 && cellValue === this.board[row][col + 1]) {
                    return false;
                }

                // Check down neighbor
                if (row < this.size - 1 && cellValue === this.board[row + 1][col]) {
                    return false;
                }
            }
        }
        return true; // No moves left
    }
    public mergeUp(): void {
        // Implementation for merging cells upwards
        for (let col = 0; col < this.size; col++) {
            let lastMergeRow = -1; // Track the last row where a merge occurred
            for (let row = 1; row < this.size; row++) {
                if (this.board[row][col] !== null) {
                    let targetRow = row;
                    while (targetRow > 0 && this.board[targetRow - 1][col] === null) {
                        targetRow--;
                    }
                    if (targetRow > 0 && this.board[targetRow - 1][col] === this.board[row][col] && lastMergeRow !== targetRow - 1) {
                        // Merge
                        this.board[targetRow - 1][col]! *= 2;
                        this.score += this.board[targetRow - 1][col]!;
                        this.setCell(row, col, null);
                        lastMergeRow = targetRow - 1;
                    } else if (targetRow !== row) {
                        // Move
                        this.setCell(targetRow, col, this.board[row][col]);
                        this.setCell(row, col, null);
                    }
                }
            }
        }
        this.insertRandomNumber();
        this.display();
    }
    public mergeDown(): void {
        // Implementation for merging cells downwards
        for (let col = 0; col < this.size; col++) {
            let lastMergeRow = this.size; // Track the last row where a merge occurred
            for (let row = this.size - 2; row >= 0; row--) {
                if (this.board[row][col] !== null) {
                    let targetRow = row;
                    while (targetRow < this.size - 1 && this.board[targetRow + 1][col] === null) {
                        targetRow++;
                    }
                    if (targetRow < this.size - 1 && this.board[targetRow + 1][col] === this.board[row][col] && lastMergeRow !== targetRow + 1) {
                        // Merge
                        this.board[targetRow + 1][col]! *= 2;
                        this.score += this.board[targetRow + 1][col]!;
                        this.setCell(row, col, null);
                        lastMergeRow = targetRow + 1;
                    } else if (targetRow !== row) {
                        // Move
                        this.setCell(targetRow, col, this.board[row][col]);
                        this.setCell(row, col, null);
                    }
                }
            }
        }
        this.insertRandomNumber();
        this.display();
    }
    public mergeLeft(): void {
        // Implementation for merging cells to the left
        for (let row = 0; row < this.size; row++) {
            let lastMergeCol = -1; // Track the last column where a merge occurred
            for (let col = 1; col < this.size; col++) {
                if (this.board[row][col] !== null) {
                    let targetCol = col;
                    while (targetCol > 0 && this.board[row][targetCol - 1] === null) {
                        targetCol--;
                    }
                    if (targetCol > 0 && this.board[row][targetCol - 1] === this.board[row][col] && lastMergeCol !== targetCol - 1) {
                        // Merge
                        this.board[row][targetCol - 1]! *= 2;
                        this.score += this.board[row][targetCol - 1]!;
                        this.setCell(row, col, null);
                        lastMergeCol = targetCol - 1;
                    } else if (targetCol !== col) {
                        // Move
                        this.setCell(row, targetCol, this.board[row][col]);
                        this.setCell(row, col, null);
                    }
                }
            }
        }
        this.insertRandomNumber();
        this.display();
    }
    public mergeRight(): void {
        // Implementation for merging cells to the right
        for (let row = 0; row < this.size; row++) {
            let lastMergeCol = this.size; // Track the last column where a merge occurred
            for (let col = this.size - 2; col >= 0; col--) {
                if (this.board[row][col] !== null) {
                    let targetCol = col;
                    while (targetCol < this.size - 1 && this.board[row][targetCol + 1] === null) {
                        targetCol++;
                    }
                    if (targetCol < this.size - 1 && this.board[row][targetCol + 1] === this.board[row][col] && lastMergeCol !== targetCol + 1) {
                        // Merge
                        this.board[row][targetCol + 1]! *= 2;
                        this.score += this.board[row][targetCol + 1]!;
                        this.setCell(row, col, null);
                        lastMergeCol = targetCol + 1;
                    } else if (targetCol !== col) {
                        // Move
                        this.setCell(row, targetCol, this.board[row][col]);
                        this.setCell(row, col, null);
                    }
                }
            }
        }
        this.insertRandomNumber();
        this.display();
    }
    public async suggestAIMove(): Promise<void> {
        const boardState = `Current board state:\n${this.convertBoardToString(this.board)}`;
        const history = `Move history:\n${this.getMoveHistoryString()}`;
        const question = `Based on the current board state and move history, please suggest the best next move.\n\n${boardState}\n\n${history}`;
        await this.aiHelper.suggestMove(question);
    }
}

