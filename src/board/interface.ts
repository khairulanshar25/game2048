// Define types for the game board
export type CellValue = number | null;
export type GameBoard = CellValue[][];
export type BoardRow = CellValue[];
export interface GameMove {
    direction: 'up' | 'down' | 'left' | 'right';
    score?: number;
    gameBoard?: GameBoard;
}