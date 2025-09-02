# 🎮 Game 2048

A TypeScript implementation of the classic 2048 puzzle game with AI assistance, running in your terminal.

## 🎯 Features

- ✅ Classic 2048 gameplay in terminal
- 🤖 AI-powered move suggestions 
- 📊 Score tracking and move history
- 🎨 Colorful display with emoji icons
- ⌨️ Simple keyboard controls
- 🔄 Reset and help commands
- 📝 Comprehensive logging

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/khairulanshar25/game2048.git
cd game2048

# Install dependencies
npm install
```

### Running the Game

```bash
# Development mode (recommended)
npm run start:dev

# Production mode
npm start
```

## 🕹️ How to Play

### Game Controls

| Command            | Action              |
|--------------------|---------------------|
| `up` or `w`        | Move tiles up       |
| `down` or `s`      | Move tiles down     |
| `left` or `a`      | Move tiles left     |
| `right` or `d`     | Move tiles right    |
| `ai` or `ai-move`  | Get AI suggestion   |
| `reset` or `r`     | Reset the game      |
| `display` or `show`| Show current board  |
| `help` or `h`      | Show help menu      |
| `quit` or `q`      | Exit game           |

### Game Rules

1. **Objective**: Combine tiles to reach 2048
2. **Movement**: All tiles slide in the chosen direction
3. **Merging**: Identical adjacent tiles combine and double
4. **New Tiles**: Random 2 or 4 appears after each move
5. **Game Over**: No moves possible when board is full

### Example Gameplay

```
Current Score: 128
Current Board:
Row 0: [null,  2  ,  4  , null]
Row 1: [ 2  ,  4  ,  8  ,  2  ]
Row 2: [null, null,  2  ,  4  ]
Row 3: [ 2  , null,  4  ,  8  ]

Enter your move (type up or w, down or s, left or a, right or d).
Type ai-move or ai to ask AI for a move suggestion.
Type help or h to display this help message.
Type quit or q to exit.
> up
```

## 🤖 AI Assistant

The game includes an AI helper that can suggest the best moves:

1. Type `ai` or `ai-move` during gameplay
2. The AI analyzes the current board and move history
3. Get strategic suggestions to maximize your score

### AI Configuration

Configure AI settings in `.env` file:

```env
AI_URL=https://khairulanshar.com
AI_MODEL=llama3.2:3b-instruct-q8_0
```

**💡 Tip**: To see the payload being sent to the AI server, change `LOG_LEVEL` to `debug` in your `.env` file:

```env
LOG_LEVEL=debug
```

## 📁 Project Structure

```
src/
├── board/              # Game logic and board management
├── ai-helpers/         # AI integration
├── utils/              # Utility functions
│   ├── string.ts       # Text formatting
│   ├── array.ts        # Array operations
│   ├── logger.ts       # Logging system
│   ├── readline.ts     # Input handling
│   └── CustomSet.ts    # Custom Set implementation for positions
├── config/             # Configuration management
├── main-program/       # Main game loop
└── index.ts            # Entry point
```

### 🔧 CustomSet Utility

The game uses a custom `CustomSet` class for efficient tracking of empty board positions:

```typescript
// Track empty cells using [row, col] coordinates
const availableCells = new CustomSet();
availableCells.add([0, 1]);    // Add position row=0, col=1
availableCells.has([0, 1]);    // Check if position exists
availableCells.delete([0, 1]); // Remove position
```

**Key Features:**
- **Position Tracking**: Stores board positions as `[row, col]` tuples
- **Fast Operations**: O(1) add, delete, and lookup operations
- **Memory Efficient**: Uses string keys internally ("row,col" format)
- **Sorted Access**: Returns positions sorted by row then column
- **Type Safe**: Interfaces ensure correct position format

**Why CustomSet?**
- JavaScript's native `Set` doesn't work well with arrays/objects
- Provides array-like interface while maintaining Set performance
- Essential for tracking empty cells during gameplay

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# AI Configuration
AI_URL=https://khairulanshar.com
AI_MODEL=llama3.2:3b-instruct-q8_0

# Logging Configuration
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_FILE_PATH=logs/app.log
```

## 📦 Available Scripts

| Script              | Description                           |
|---------------------|---------------------------------------|
| `npm run build`     | Compile TypeScript to JavaScript     |
| `npm start`         | Run compiled version                  |
| `npm run start:dev` | Run with ts-node (development)       |
| `npm run watch`     | Watch mode compilation                |
| `npm run clean`     | Remove build directory                |

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests (if available)
npm test
```

### Code Structure

- **TypeScript**: Strict typing throughout
- **Modular Design**: Separated concerns and utilities
- **Error Handling**: Comprehensive error management
- **Logging**: Multiple log levels with file output
- **Clean Architecture**: Easy to extend and maintain

## 🎨 Customization

### Display Settings

Modify cell formatting in `src/utils/string.ts`:

```typescript
export function formatCell(cell: number | null, width: number = 4): string {
    // Customize cell display here
}
```

### Game Rules

Adjust game mechanics in `src/board/index.ts`:

```typescript
// Modify spawn probability
const randomValue = Math.random() < 0.9 ? 2 : 4;

// Change board size (requires multiple changes)
private readonly size: number = 4;
```

## 🐛 Troubleshooting

### Common Issues

**Game exits unexpectedly**
- Make sure AI service is accessible
- Check network connectivity
- Review logs in `logs/app.log`

**AI suggestions not working**
- Verify AI_URL in `.env` file
- Ensure AI service is running
- Check AI model availability

**Installation problems**
- Use Node.js v16 or higher
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
```

## 📄 License

ISC License - see package.json for details

## 👤 Author

**Khairul Anshar**
- Email: halo@khairulanshar.com
- GitHub: [@khairulanshar25](https://github.com/khairulanshar25)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Additional Resources

- [Original 2048 Game](https://play2048.co)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Node.js Documentation](https://nodejs.org)

## 🎉 Acknowledgments

- Inspired by the original 2048 game by Gabriele Cirulli
- Built with TypeScript and Node.js
- AI integration for enhanced gameplay

---

**Enjoy playing 2048! 🎮✨**

> Tip: Try to keep your highest tile in a corner for better strategy!