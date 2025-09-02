# 2048 Game Assumptions

## 🎮 **Game Board**
1. **Board Size**: Always 4x4 grid
2. **Cell Values**: Numbers (2, 4, 8, 16...) or empty (null)
3. **Board Layout**: 2D array with rows and columns
4. **Position Numbers**: Rows and columns numbered 0, 1, 2, 3

## 🎲 **Random Numbers**
5. **New Number Chance**: 90% chance for 2, 10% chance for 4
6. **Multiple Numbers**: Can add several numbers at once
7. **Game Start**: Board starts with random numbers
8. **After Each Move**: Always add new numbers after moving

## 🎯 **Game Rules**
9. **Merging**: Only side-by-side cells can merge
10. **One Merge**: Each cell merges only once per move
11. **Merge Result**: Combined cells double (2+2=4, 4+4=8)
12. **Score**: Score goes up by merged cell values
13. **Winning**: Get 2048 to win
14. **Game Over**: Board full and no moves left

## 🕹️ **Controls**
15. **Move Commands**:
    - `up` or `w` = move up
    - `down` or `s` = move down
    - `left` or `a` = move left
    - `right` or `d` = move right
16. **Typing**: Commands work in any case (UP, up, Up)
17. **Interface**: Runs in terminal/command line
18. **Players**: One player only
19. **Input**: Game waits for your command each turn

## 🤖 **AI Helper**
20. **AI Service**: Gets suggestions from web service
21. **AI Address**: Default at `https://khairulanshar.com`
22. **AI Model**: Uses `llama3.2:3b-instruct-q8_0`
23. **AI Input**: Sends board and move history as text
24. **AI Optional**: Game works without AI

## 📊 **Data Storage**
25. **Memory Only**: Game state not saved to files
26. **Move History**: Keeps track of all moves made
27. **Text Format**: Can convert board to text
28. **Empty Cells**: Tracks empty spots for speed

## 🔧 **Technical**
29. **TypeScript**: Uses strict typing
30. **Node.js**: Runs on Node.js
31. **Modern Code**: Uses import/export
32. **Error Handling**: Shows errors for wrong moves
33. **Logging**: Records info, errors, debug messages
34. **Settings**: Uses .env file for configuration

## 🎨 **Display**
35. **Cell Width**: All cells same width (4 characters)
36. **Empty Cells**: Show "null" for empty spots
37. **Number Position**: Numbers centered in cells
38. **Board Display**: Shows each row separately
39. **Colors**: Different colors for different messages

## 🚀 **Speed**
40. **Fast Checks**: Quick way to check if board is full
41. **Cell Tracking**: Uses "row,col" text to track cells
42. **Single Input**: One input handler for whole game
43. **AI Loading**: AI helper starts only when needed

## 🔒 **Safety**
44. **Input Checking**: Checks if moves are valid
45. **Boundary Check**: Row/column must be 0-3
46. **Safe Logging**: Prevents infinite loops in logs
47. **No Secrets**: No passwords in code

## 🌐 **Environment**
48. **Dev Mode**: Can run without building
49. **Cross-Platform**: Works on Mac/Linux/Windows
50. **Local AI**: AI service runs on same computer
51. **File Logs**: Can save logs to files

## 🎪 **User Experience**
52. **Quick Feedback**: Shows board after each move
53. **Help**: Built-in help command
54. **Clean Exit**: Closes properly when quitting
55. **Keep Going**: Game continues even if errors happen
56. **Reset**: Can restart without closing game 