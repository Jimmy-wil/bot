# Discord Cold Caller Bot

## Overview
This is a Discord bot designed to track and reward "closes" (sales closures) for a team of cold callers. The bot provides a gamified system with levels, progress bars, and leaderboards to motivate and track team performance.

**Current State**: Fully functional and running in Replit environment

**Last Updated**: October 5, 2025

## Features
- **Close Tracking**: Bosses can award closes to callers using `!close @user`
- **Revoke System**: Bosses can remove closes using `!revoke @user`
- **User Profiles**: View stats with `!profile` or `!profile @user`
- **Leaderboard**: Top 10 callers displayed with `!leaderboard`
- **Level System**: Bronze → Silver → Gold → Platinum progression
- **Progress Bars**: Visual representation of progress to next level

## Project Architecture

### Structure
```
src/
├── bot.js              # Main bot file, handles Discord connection
├── config.js           # Configuration (prefix, role names)
├── commands/           # Command handlers
│   ├── close.js       # Award a close to a caller
│   ├── revoke.js      # Remove a close from a caller
│   ├── profile.js     # Display user profile
│   └── leaderboard.js # Display top 10 leaderboard
├── database/           # Database layer
│   └── callers.js     # SQLite operations for caller data
└── utils/              # Utility functions
    └── progressBar.js # Level and progress bar logic

data.sqlite             # SQLite database file
```

### Technology Stack
- **Runtime**: Node.js v20
- **Discord Library**: discord.js v14
- **Database**: better-sqlite3 (SQLite)
- **Environment**: dotenv for secrets management

### Database Schema
```sql
CREATE TABLE callers (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  xp INTEGER DEFAULT 0,
  closes INTEGER DEFAULT 0
)
```

### Level System
- **Bronze**: 0-4 closes
- **Silver**: 5-14 closes
- **Gold**: 15-29 closes
- **Platinum**: 30+ closes

## Discord Setup Requirements

### Bot Permissions
The bot requires the following Discord permissions:
- Read Messages/View Channels
- Send Messages
- Manage Webhooks (for leaderboard)
- Read Message History

### Required Roles
- **Boss**: Can award and revoke closes
- **Cold Caller**: Can receive closes and appear on leaderboard

### Required Channel
- **🏆-score-board**: Channel where close announcements and leaderboard are posted

## Configuration

### Environment Variables (Secrets)
- `BOT_TOKEN`: Discord bot token (stored in Replit Secrets)

### Bot Configuration (`src/config.js`)
- `PREFIX`: Command prefix (default: `!`)
- `ROLE_BOSS`: Role name for managers (default: `Boss`)
- `ROLE_CALLER`: Role name for callers (default: `Cold Caller`)

## Commands

All commands use the `!` prefix:

| Command | Permission | Description |
|---------|-----------|-------------|
| `!close @user` | Boss only | Award a close to a caller |
| `!revoke @user` | Boss only | Remove a close from a caller |
| `!profile [@user]` | Everyone | View profile (self or mentioned user) |
| `!leaderboard` | Everyone | Display top 10 callers |

## Recent Changes

### October 5, 2025 - Initial Replit Setup
- Rebuilt better-sqlite3 for Node.js v20 compatibility
- Fixed database access bug in revoke.js command
- Added `removeCloseFromUser()` function to database module
- Updated `ready` event to `clientReady` to fix deprecation warning
- Created .gitignore for Node.js project
- Configured Discord Bot workflow for console output
- Set up BOT_TOKEN in Replit Secrets

## Development Notes

### Running the Bot
The bot runs automatically via the "Discord Bot" workflow. It will:
1. Load environment variables from Replit Secrets
2. Connect to Discord using BOT_TOKEN
3. Load all commands from the commands folder
4. Listen for messages starting with the prefix

### Database Management
- Database is persistent in Replit storage
- Uses SQLite with better-sqlite3 (synchronous API)
- All database operations are in `src/database/callers.js`

### Adding New Commands
1. Create a new file in `src/commands/`
2. Export an object with `name` and `execute` function
3. Bot automatically loads all .js files in commands folder

### Troubleshooting
- If better-sqlite3 fails: Run `npm rebuild better-sqlite3`
- Bot needs proper Discord permissions and roles configured
- Ensure the `🏆-score-board` channel exists in your Discord server

## User Preferences
- French language used in bot responses
- Emoji-based feedback for user actions
- Visual progress bars for engagement
