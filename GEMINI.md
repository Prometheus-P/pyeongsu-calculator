# GEMINI.md - Pyeongsu Calculator

This document provides a comprehensive overview of the Pyeongsu Calculator project for Gemini.

## Project Overview

This is a real estate area converter application that provides real-time, bidirectional conversion between "Pyeong" (a Korean unit of area) and square meters (㎡). The project is implemented in two distinct versions:

1.  **Standalone Version**: A single, self-contained HTML file (`standalone.html`) with vanilla JavaScript and CSS. This version is ideal for quick demos and simple deployments without a build step.
2.  **React Version**: A modern, scalable web application built with React, Vite, and Tailwind CSS. This is the main version for future development.

The user interface for both versions is meticulously crafted based on Google's **Material 3 (M3)** design system, ensuring a modern, consistent, and accessible user experience.

### Key Technologies

-   **Frontend (React Version)**: React 18, Vite, Tailwind CSS
-   **Design System**: Material 3 (custom implementation via Tailwind CSS config)
-   **Core Logic**: JavaScript

## Building and Running

The project uses `npm` for package management.

### Prerequisites

-   Node.js (v18 or later)
-   `npm`

### Development

To run the React version in a local development environment:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Production

To build the application for production:

1.  **Build the project:**
    ```bash
    npm run build
    ```
    This command creates a `dist/` directory with the optimized static assets.

2.  **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

### Code Style

-   **React**: The codebase uses modern React with functional components and hooks. The main application logic is encapsulated within the `src/PyeongsuCalculator.jsx` component.
-   **Styling**: Styling is handled by Tailwind CSS, following a utility-first approach.
-   **Material 3 Design System**: The project adheres to Material 3 principles. All design tokens (colors, typography, spacing, shadows) are centrally managed in `tailwind.config.js`. Custom M3 component classes (e.g., `.m3-button-filled`, `.m3-textfield-filled`) are defined in `src/index.css` for reusability, as detailed in the `README.md`.

### Project Structure

The project is organized as follows:

```
/
├── standalone.html         # Standalone, self-contained version
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # M3 design tokens for Tailwind CSS
├── vite.config.js          # Vite build configuration
├── index.html              # Entry point for the React app
└── src/
    ├── main.jsx            # React application root
    ├── PyeongsuCalculator.jsx  # Main React component
    └── index.css           # Global styles and custom M3 component classes
```

### Key Files for Reference

-   `README.md`: Contains detailed documentation about the project, including setup, design system specifications, and version history.
-   `tailwind.config.js`: The source of truth for all Material 3 design tokens (colors, fonts, etc.). Refer to this file when implementing new UI elements to ensure consistency.
-   `src/PyeongsuCalculator.jsx`: The core component of the React application. Contains the state management and conversion logic.
-   `standalone.html`: A complete, dependency-free implementation. Useful for understanding the basic HTML structure and CSS.

## Active Technologies
- TypeScript 5.5.x + Astro 4.16.x, React 18.3.x, Tailwind CSS 3.4.x (002-material-design-3)
- N/A (localStorage for theme persistence) (002-material-design-3)
- TypeScript 5.5 + None (pure TypeScript, no external libraries) (003-converter-strategy-pattern)
- N/A (stateless utility functions) (003-converter-strategy-pattern)

## Recent Changes
- 002-material-design-3: Added TypeScript 5.5.x + Astro 4.16.x, React 18.3.x, Tailwind CSS 3.4.x
