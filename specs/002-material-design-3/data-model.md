# Data Model: Material Design 3 Tokens

This document defines the structure of the design tokens used to implement the M3 design system.

## Token Entities

### 1. Color Token

M3 color tokens are defined as a hierarchical object in `tailwind.config.js` under the `theme.extend.colors.m3` key. This structure groups related colors (e.g., a container color and the text color meant to be placed on it) and improves discoverability.

**Structure:**
```javascript
// tailwind.config.js
{
  // ...
  theme: {
    extend: {
      colors: {
        m3: {
          primary: {
            DEFAULT: '#6750A4', // The main primary color
            on: '#FFFFFF',      // Color for text/icons on top of primary
            container: '#EADDFF', // A lighter/softer container color
            onContainer: '#21005E' // Color for text/icons on top of container
          },
          secondary: {
            // ... similar structure
          },
          surface: {
            // ... similar structure
          }
          // ... etc.
        }
      }
    }
  }
}
```

**Seed Color**: The palette is generated from the seed color **Blue (#1976D2)**.

### 2. Typography Token

M3 typography tokens are defined as an array in `tailwind.config.js` under the `theme.extend.fontSize` key. This allows a single Tailwind utility class (e.g., `text-m3-headline-large`) to apply font size, line height, and font weight simultaneously, ensuring consistency.

**Structure:**
```javascript
// tailwind.config.js
{
  // ...
  theme: {
    extend: {
      fontSize: {
        'm3-headline-large': ['32px', {
          lineHeight: '40px',
          fontWeight: '400',
          letterSpacing: '0'
        }],
        'm3-title-medium': ['16px', {
          lineHeight: '24px',
          fontWeight: '500',
          letterSpacing: '0.15px'
        }]
        // ... etc. for all M3 type scale entries
      }
    }
  }
}
```

### 3. Elevation Token

Represents the M3 shadow system. Defined in `tailwind.config.js` under `theme.extend.boxShadow`.

- **Levels**: `m3-level-0` to `m3-level-5`.
- **Usage**: Applied with classes like `shadow-m3-level-2`.

### 4. State Layer Token

Represents the translucent overlays used for interaction states (hover, focus, press). This is not a direct token in Tailwind but is implemented as a utility class that applies a semi-transparent `background-color` overlay.

- **States**: Hover (8% opacity), Focus (12%), Pressed (12%).
- **Implementation**: A base class like `.m3-state-layer` is applied to interactive elements.