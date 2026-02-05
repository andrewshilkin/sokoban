# Sokoban

A classic Sokoban puzzle game built with **PixiJS v8** and vanilla JavaScript.

Push all boxes onto the goal markers to complete each level.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow keys | Move player |
| Z | Undo last move |
| R | Restart level |

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Tech Stack

- **PixiJS v8** - 2D rendering
- **Vite** - build tooling and dev server
- **ES Modules** - native JavaScript modules
- **Custom MVC** - observer-based model-view architecture
- **Tween animation system** - smooth sprite movement with ease-out interpolation
