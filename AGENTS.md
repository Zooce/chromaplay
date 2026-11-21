# AGENTS.md - Chromaplay Development Guide

## Project Overview

A color palette experimentation tool built with SolidJS 2 and Vite. Deployed to GitHub Pages at https://zooce.github.io/chromaplay

## Tech Stack

- **Framework**: SolidJS 2 (`solid-js` and `@solidjs/web`)
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Tools**: mise (`mise.toml`). Bun installs packages and runs the scripts. Node is pinned beside it.
- **Versions**: Bun 1.4.5, Node 26.13.1

---

## Commands

### Development
```bash
mise run dev      # Start dev server with hot reload
```

### Build
```bash
mise run build    # Build for production (outputs to ./dist)
```

### Single Test
No test framework is currently configured. Tests should be added using a compatible SolidJS testing library (e.g., @solidjs/testing).

### Lint
No linting is configured. Consider adding ESLint with solid-js plugin if needed.

---

## Code Style Guidelines

### File Organization
- App code: `src/`
- CSS Modules: Co-located with components (`ComponentName.module.css`)

### Naming Conventions
- **Files**: camelCase (e.g., `colorControls.jsx`, `colorUtils.js`)
- **Components**: PascalCase (e.g., `ColorControls`, `ColorComponentControl`)
- **CSS Classes**: kebab-case in CSS, accessed via camelCase in JS (e.g., `styles.ColorControls`)
- **Functions/variables**: camelCase

### Imports
Order imports as:
1. CSS modules (e.g., `import styles from "./index.module.css"`)
2. External libraries (`solid-js`, `@solidjs/web`)
3. Internal components
4. Internal utilities

```jsx
import styles from "./Component.module.css";
import { createSignal, createMemo } from "solid-js";
import { render } from "@solidjs/web";
import ColorControls from "./ColorControls";
import { rgbToHsl, hslToRgb } from "./colorUtils";
```

### Reactivity (SolidJS)
- Use `createSignal()` for reactive state
- Use `createMemo()` for derived/computed values
- Use `createEffect(compute, effect)` for side effects. The compute reads signals. The effect does the work.
- Use `untrack()` when you need to read a signal without creating a dependency
- Prefer signals over stores for simple state

### JSX Patterns
- Use `<For>` instead of `.map()` for list rendering
- Use `<Show>` for conditional rendering
- Use `<Portal>` from `@solidjs/web` for portal rendering
- Bind refs directly: `<div ref={myRef}>`

### Error Handling
- Use try/catch for operations that may fail (e.g., `hexToRgb`)
- Empty catch blocks are acceptable for known invalid input scenarios

### CSS
- Use CSS Modules for component-scoped styles
- Prefer inline styles for dynamic values via JS objects
- Follow kebab-case for CSS properties in inline styles: `{ "background-color": "red" }`

---

## GitHub Pages Deployment

The app is configured to deploy to `/chromaplay/` subdirectory:
- Vite config sets `base: "/chromaplay/"`
- `mise run build` writes `./dist`
- GitHub Actions installs the mise tools, runs `mise run build`, and deploys `dist` to GitHub Pages

To build and preview locally:
```bash
mise run serve
```

---

## Existing Patterns

### Color Management
- Uses both RGB and HSL color modes
- Utils in `src/colorUtils.js` handle conversions
- Global state in `src/global.js`

### Components
- `ColorControls`: Main color editing component
- `ColorComponentControl`: Individual slider controls
- `src/App.jsx` contains the main application logic

---

## Notes for Agents

- This is a small project with no test suite
- No linting/formatting tools configured
- Production build is a static Vite bundle
- No API routes or backend
- Keep changes minimal and focused