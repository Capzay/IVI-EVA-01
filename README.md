# IVI-EVA-01 Discord Bot 🤖

A feature-rich Discord bot designed for the ivi vr esports discord server, providing role management, availability tracking, leveling systems, and game-specific ping features.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Configuration](#-configuration)
- [Commands](#-commands)
- [Bot Features](#-bot-features)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 🎮 Game Ping System

- **Looking to Play Roles**: Ping-to-play system for multiple games
  - Orion Drift (OD)
  - Breachers (BRC)
  - Beat Saber (BS)
  - Gorilla Tag (GTAG)
- **30-minute cooldown** to prevent spam
- Game-specific channels with custom messages
- Beautiful embeds with author information

### 🎭 Reaction Role System

- Self-assignable roles via button interactions
- Game roles for receiving pings
- Media roles for content notifications (Live Ping, ivi Media Ping)
- Easy toggle on/off by clicking buttons again

### 📊 Leveling System (XP)

- Automatic XP gain from messages (1-2 XP per message)
- 5 levels with progressive requirements:
  - Level 1: 100 XP
  - Level 2: 250 XP
  - Level 3: 400 XP
  - Level 4: 750 XP
  - Level 5: 1000 XP
- Automatic role assignment on level up
- Level progression notifications

### 📅 Availability Tracking

- Team captains can set up availability tracking
- Weekly availability calendar (Monday-Sunday)
- Members can mark their availability with button clicks
- Automatic embed updates
- Captain-controlled setup and teardown

### 🛠️ Staff Management Tools

- Embed management system for rules, resources, and reaction roles
- Channel clearing functionality
- Permission-based command access

---

## 📦 Prerequisites

- **Node.js** v20 or higher
- **npm** or **yarn** package manager
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- **Git** (for cloning the repository)
- **(Optional)** Docker for containerized deployment

---

## 🚀 Setup Instructions

### Local Development

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Capzay/IVI-EVA-01.git
   cd IVI-EVA-01
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create Environment File**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Bot Configuration
   BOT_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   GUILD_ID=your_discord_server_id_here

   # Channel IDs
   REACTION_ROLES=reaction_roles_channel_id
   RESOURCES=resources_channel_id
   RULES=rules_channel_id
   AVAILABILITY=availability_channel_id

   # Other Configuration (if needed)
   ERROR_CHANNEL=error_log_channel_id
   ```

4. **Create Required Directories**

   ```bash
   mkdir -p src/data/availability
   ```

5. **Initialize Data Files**

   Create `src/data/levels.json`:

   ```json
   {
     "roles": {
       "Level 1": "role_id_here",
       "Level 2": "role_id_here",
       "Level 3": "role_id_here",
       "Level 4": "role_id_here",
       "Level 5": "role_id_here"
     }
   }
   ```

   Create `src/data/availability-config.json`:

   ```json
   {}
   ```

6. **Build the Project**

   ```bash
   npm run build
   ```

7. **Deploy Commands to Discord**

   ```bash
   node dist/deploy.js
   ```

8. **Run the Bot**
   ```bash
   npm run dev
   ```

---

### Docker Deployment

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Capzay/IVI-EVA-01.git
   cd IVI-EVA-01
   ```

2. **Create Your `.env` File**

   Follow step 3 from the Local Development section above.

3. **Build the Docker Image**

   ```bash
   docker build -t ivi-eva-01 .
   ```

4. **Run the Container**

   ```bash
   docker run -d --name ivi-bot -v ${PWD}/.env:/app/.env ivi-eva-01
   ```

   Or with bind mounts for persistent data:

   ```bash
   docker run -d --name ivi-bot \
     -v ${PWD}/.env:/app/.env \
     -v ${PWD}/src/data:/app/src/data \
     ivi-eva-01
   ```

5. **View Logs**

   ```bash
   docker logs -f ivi-bot
   ```

6. **Stop the Container**
   ```bash
   docker stop ivi-bot
   ```

---

## ⚙️ Configuration

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to "Bot" section and create a bot
4. Enable the following **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent
   - Presence Intent
5. Copy the bot token to your `.env` file
6. Generate an invite link with the following permissions:
   - Send Messages
   - Manage Roles
   - Manage Messages
   - Read Message History
   - Use Slash Commands
   - Embed Links

### Hardcoded IDs Configuration

The bot uses several hardcoded Discord IDs that you'll need to replace with your own. All IDs are marked with comments for easy searching.

#### Quick Search Guide

To find all hardcoded IDs in the codebase, search for these comment patterns:

- `// ROLE_ID:` - Discord role IDs
- `// CHANNEL_ID:` - Discord channel IDs
- `// EMOJI_ID:` - Custom emoji IDs

#### Role IDs to Configure

**1. Game Ping Roles** (`src/containers/ReactionRoles.ts`):

```typescript
const gameRoles = [
  { id: "1343578200487366666", label: "Looking to Play - OD" }, // ROLE_ID: Looking to Play - OD
  { id: "1343578300135772200", label: "Looking to Play - BRC" }, // ROLE_ID: Looking to Play - BRC
  { id: "1343578328979869706", label: "Looking to Play - BS" }, // ROLE_ID: Looking to Play - BS
  { id: "1343578330644877374", label: "Looking to Play - GTAG" }, // ROLE_ID: Looking to Play - GTAG
];
```

**2. Media Ping Roles** (`src/containers/ReactionRoles.ts`):

```typescript
const mediaRoles = [
  { id: "1343715989476610081", label: "Live Ping" }, // ROLE_ID: Live Ping role
  { id: "1343716033730580591", label: "ivi Media Ping" }, // ROLE_ID: ivi Media Ping role
];
```

**3. Level Roles** (`src/data/levels.json`):

```json
{
  "roles": {
    "Level 1": "your_level_1_role_id",
    "Level 2": "your_level_2_role_id",
    "Level 3": "your_level_3_role_id",
    "Level 4": "your_level_4_role_id",
    "Level 5": "your_level_5_role_id"
  }
}
```

#### Channel IDs to Configure

Each ping command requires a specific channel where it can be used:

| File                               | Channel Purpose           | Line/Variable                                   |
| ---------------------------------- | ------------------------- | ----------------------------------------------- |
| `src/commands/Public/od-ping.ts`   | OD ping command channel   | `channel_to_be_used_in = "1343719901314945129"` |
| `src/commands/Public/brc-ping.ts`  | BRC ping command channel  | `channel_to_be_used_in = "1343720230081400963"` |
| `src/commands/Public/bs-ping.ts`   | BS ping command channel   | `channel_to_be_used_in = "1343720559405699253"` |
| `src/commands/Public/gtag-ping.ts` | GTAG ping command channel | `channel_to_be_used_in = "1343721013518532650"` |

#### Custom Emoji IDs

**Level Up Emoji** (`src/events/giveUserXP.ts`):

- `<:ivilogo:1314905850292342784>` - Custom ivi logo emoji used in level-up messages

#### How to Get Discord IDs

1. **Enable Developer Mode** in Discord:

   - User Settings → Advanced → Developer Mode (toggle on)

2. **Get Role IDs**:

   - Server Settings → Roles → Right-click role → Copy ID

3. **Get Channel IDs**:

   - Right-click any channel → Copy ID

4. **Get Emoji IDs**:
   - Type `\:emoji_name:` in chat to see the emoji ID
   - Or right-click emoji → Copy Link → ID is in the URL

---

## 🎯 Commands

### Public Commands

| Command      | Description                      | Usage                                    | Cooldown   |
| ------------ | -------------------------------- | ---------------------------------------- | ---------- |
| `/ping-od`   | Ping Looking to Play - OD role   | `/ping-od <message>`                     | 30 minutes |
| `/ping-brc`  | Ping Looking to Play - BRC role  | `/ping-brc <message>`                    | 30 minutes |
| `/ping-bs`   | Ping Looking to Play - BS role   | `/ping-bs <message> <modded> <game_ver>` | 30 minutes |
| `/ping-gtag` | Ping Looking to Play - GTAG role | `/ping-gtag <message>`                   | 30 minutes |

### Staff Commands (Requires Admin Permissions)

| Command             | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `/send-embeds`      | Resends embeds for rules, resources, and reaction roles |
| `/setup-management` | Sends management tools embed                            |

---

## 🎨 Bot Features

### Reaction Roles

Members can self-assign roles by clicking buttons in the reaction roles channel:

- **Game Roles**: Get pinged when someone wants to play
- **Content Roles**: Get notified about streams and content uploads

### Automatic XP System

- Earn 1-2 XP per message automatically
- Progress through 5 levels
- Receive role promotions automatically
- Old level roles are removed when you level up

### Availability Tracking

- Team captains can set up weekly availability tracking
- Members click buttons to mark their availability
- Real-time embed updates showing who's available
- Captains can stop tracking at any time

### Smart Cooldowns

- 30-minute server-wide cooldown on ping commands
- Prevents spam and notification fatigue
- User-friendly cooldown messages showing remaining time

---

## 📁 Project Structure

```
IVI-EVA-01/
├── src/
│   ├── commands/
│   │   ├── Public/          # Public slash commands
│   │   │   ├── brc-ping.ts
│   │   │   ├── bs-ping.ts
│   │   │   ├── gtag-ping.ts
│   │   │   └── od-ping.ts
│   │   └── Staff/           # Staff-only commands
│   │       ├── managementTools.ts
│   │       └── sendEmbeds.ts
│   ├── containers/          # UI component containers
│   │   ├── Availability.ts
│   │   ├── ReactionRoles.ts
│   │   ├── Resources.ts
│   │   └── Rules.ts
│   ├── data/               # Bot data storage
│   │   ├── availability-config.json
│   │   ├── levels.json
│   │   └── availability/   # Per-team availability data
│   ├── embeds/             # Embed builders
│   ├── events/             # Discord event handlers
│   ├── handlers/           # Business logic handlers
│   ├── types/              # TypeScript type definitions
│   └── util/               # Utility functions
├── .env                    # Environment variables (create this)
├── Dockerfile              # Docker configuration
├── package.json            # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

---

## 🔧 Troubleshooting

### Bot doesn't respond to commands

- Ensure slash commands are deployed (`node dist/deploy.js`)
- Check bot has necessary permissions in your server
- Verify bot token is correct in `.env`

### XP system not working

- Ensure `src/data/levels.json` exists and has correct role IDs
- Check bot has permission to assign roles
- Verify role hierarchy (bot role must be above level roles)

### Ping commands show cooldown error

- Cooldowns are server-wide and last 30 minutes
- Check if the command is being used in the correct channel

### Docker container won't start

- Verify `.env` file exists and has correct format
- Check Docker logs: `docker logs ivi-bot`
- Ensure required data files exist

---

## 📝 Notes

- The bot uses Europe/London timezone by default
- Data is stored in JSON files (consider database for production)
- Message XP is randomized between 1-2 XP per message
- Level 5 is the maximum level (no more XP gained after)

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Capzay**

- GitHub: [@Capzay](https://github.com/Capzay)

---

## 🎊 Acknowledgments

Built for the **ivi** gaming community with ❤️

---

Made with ☕ and Discord.js
