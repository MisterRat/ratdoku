# RatDoku — Sudoku by MrRat.com (PWA)

A sleek, high-performance Sudoku game and Progressive Web App (PWA) by **MrRat.com** with daily challenges, multiple difficulty levels, logical smart hints, offline support, and statistics tracking.

## Features

- **Progressive Web App (PWA)**: Installable on iOS, Android, macOS, Windows, and Linux with full offline gameplay support.
- **Game Modes**: Classic mode (Easy, Medium, Hard) and Daily Challenges with calendar history and streak tracking.
- **Smart Hint System**: Step-by-step logical hints (Naked Singles, Hidden Singles, Block Intersections, Naked Pairs, and more) with visual explanations.
- **Customizable Themes**: Elegant Dark (obsidian), Minimal Light, Warm Paper, Dark Slate, and Nordic Forest.
- **Rich Gameplay Controls**: Undo, candidate pencil notes, auto-error checking, matching number highlights, peer highlights, sound effects, and timer controls.
- **100% Client-Side & Offline-First**: No external API or cloud dependency required. All game state and daily puzzles are generated and cached locally in the browser.

---

## Deploying via Portainer Stack (From GitHub Repository)

This repository is pre-configured for direct deployment through Portainer:

### Step 1: Create a Stack in Portainer
1. Open your Portainer Web UI.
2. Navigate to **Stacks** > **Add stack**.
3. Select the **Repository** build method.
4. Enter the stack name (e.g., `sudoku`).

### Step 2: Configure Repository Settings
- **Repository URL**: `https://github.com/<your-username>/<your-repo-name>`
- **Repository reference**: `refs/heads/main` (or your preferred branch)
- **Compose path**: `docker-compose.yml`

### Step 3: Environment Variables (Optional)
You can optionally define the `PORT` variable in the Portainer Environment variables section:
- `PORT=3000` (or any external port you want to bind)

### Step 4: Deploy
Click **Deploy the stack**. Portainer will clone the repository, run the multi-stage Docker build, and start the Nginx container serving the PWA on the configured port.

---

## Deploying with Docker Compose Locally / On a VPS

To run the application with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Start the stack in background
docker compose up -d --build
```

Access the app in your browser at `http://localhost:3000`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```
