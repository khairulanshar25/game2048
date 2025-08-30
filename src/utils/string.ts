/**
 * String utility functions for formatting and display
 */

/**
 * Formats a cell value for display with consistent width and centering
 * @param {number | null} cell - The cell value to format
 * @param {number} width - The desired width (default: 4)
 * @returns {string} Formatted cell string
 */
export function formatCell(cell: number | null, width: number = 4): string {
    if (cell === null) return 'null';
    
    const str = cell.toString();
    const padding = width - str.length;
    
    if (padding <= 0) return str;
    
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    
    return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
}

/**
 * Centers a string within a specified width
 * @param {string} text - The text to center
 * @param {number} width - The desired width
 * @param {string} fillChar - The character to use for padding (default: space)
 * @returns {string} Centered string
 */
export function centerString(text: string, width: number, fillChar: string = ' '): string {
    const padding = width - text.length;
    
    if (padding <= 0) return text;
    
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    
    return fillChar.repeat(leftPad) + text + fillChar.repeat(rightPad);
}

/**
 * Pads a string to the left with specified character
 * @param {string} text - The text to pad
 * @param {number} width - The desired width
 * @param {string} fillChar - The character to use for padding (default: space)
 * @returns {string} Left-padded string
 */
export function padLeft(text: string, width: number, fillChar: string = ' '): string {
    return text.padStart(width, fillChar);
}

/**
 * Pads a string to the right with specified character
 * @param {string} text - The text to pad
 * @param {number} width - The desired width
 * @param {string} fillChar - The character to use for padding (default: space)
 * @returns {string} Right-padded string
 */
export function padRight(text: string, width: number, fillChar: string = ' '): string {
    return text.padEnd(width, fillChar);
}
