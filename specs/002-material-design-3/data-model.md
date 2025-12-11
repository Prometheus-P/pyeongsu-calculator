# Data Model: M3 Design Tokens

**Feature Branch**: `002-material-design-3`
**Created**: 2025-12-02

## Overview

This document defines the M3 design token structure to be implemented in Tailwind CSS configuration and CSS custom properties.

---

## Entity: Color Token

### Purpose
Define M3 color system based on seed color #1976D2 (Blue)

### Schema

```typescript
interface M3ColorScheme {
  // Primary tones
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary tones
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary tones
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error tones
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface tones
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  // Utility tones
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  scrim: string;
  shadow: string;
}
```

### Values

#### Light Mode
| Token | Value | WCAG Contrast |
|-------|-------|---------------|
| `primary` | #1976D2 | 4.5:1 on white |
| `on-primary` | #FFFFFF | - |
| `primary-container` | #D1E4FF | - |
| `on-primary-container` | #001D35 | 11:1 |
| `secondary` | #535F70 | 4.5:1 |
| `on-secondary` | #FFFFFF | - |
| `secondary-container` | #D7E3F8 | - |
| `on-secondary-container` | #101C2B | 10:1 |
| `tertiary` | #6B5778 | 4.5:1 |
| `on-tertiary` | #FFFFFF | - |
| `surface` | #F8F9FF | - |
| `on-surface` | #191C20 | 13:1 |
| `surface-variant` | #DFE2EB | - |
| `on-surface-variant` | #43474E | 6:1 |
| `outline` | #73777F | 4.5:1 |
| `outline-variant` | #C3C6CF | 1.5:1 |
| `error` | #BA1A1A | 4.5:1 |
| `on-error` | #FFFFFF | - |

#### Dark Mode
| Token | Value | WCAG Contrast |
|-------|-------|---------------|
| `primary` | #90CAF9 | 8:1 on dark |
| `on-primary` | #003258 | - |
| `primary-container` | #004881 | - |
| `on-primary-container` | #D1E4FF | 8:1 |
| `secondary` | #BBC7DB | 7:1 |
| `on-secondary` | #263141 | - |
| `secondary-container` | #3C4858 | - |
| `on-secondary-container` | #D7E3F8 | 7:1 |
| `tertiary` | #D7BDE4 | 7:1 |
| `on-tertiary` | #3D2948 | - |
| `surface` | #111418 | - |
| `on-surface` | #E1E2E9 | 12:1 |
| `surface-variant` | #42474E | - |
| `on-surface-variant` | #C2C6CF | 7:1 |
| `outline` | #8C9199 | 4.5:1 |
| `outline-variant` | #42474E | 2:1 |
| `error` | #FFB4AB | 7:1 |
| `on-error` | #690005 | - |

---

## Entity: Typography Token

### Purpose
Define M3 type scale for text hierarchy

### Schema

```typescript
interface M3TypeScale {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
}
```

### Values

| Token | Font Size | Line Height | Weight | Letter Spacing |
|-------|-----------|-------------|--------|----------------|
| `display-large` | 57px | 64px | 400 | -0.25px |
| `display-medium` | 45px | 52px | 400 | 0 |
| `display-small` | 36px | 44px | 400 | 0 |
| `headline-large` | 32px | 40px | 400 | 0 |
| `headline-medium` | 28px | 36px | 400 | 0 |
| `headline-small` | 24px | 32px | 400 | 0 |
| `title-large` | 22px | 28px | 400 | 0 |
| `title-medium` | 16px | 24px | 500 | 0.15px |
| `title-small` | 14px | 20px | 500 | 0.1px |
| `body-large` | 16px | 24px | 400 | 0.5px |
| `body-medium` | 14px | 20px | 400 | 0.25px |
| `body-small` | 12px | 16px | 400 | 0.4px |
| `label-large` | 14px | 20px | 500 | 0.1px |
| `label-medium` | 12px | 16px | 500 | 0.5px |
| `label-small` | 11px | 16px | 500 | 0.5px |

---

## Entity: Elevation Token

### Purpose
Define M3 elevation levels using box-shadow

### Schema

```typescript
interface M3Elevation {
  level: number; // 0-5
  shadow: string;
  surfaceTint: number; // opacity for dark mode tint
}
```

### Values

| Level | Shadow (Light) | Surface Tint Opacity (Dark) |
|-------|----------------|------------------------------|
| 0 | `none` | 0% |
| 1 | `0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)` | 5% |
| 2 | `0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)` | 8% |
| 3 | `0 1px 3px rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)` | 11% |
| 4 | `0 2px 3px rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15)` | 12% |
| 5 | `0 4px 4px rgba(0,0,0,0.3), 0 8px 12px 6px rgba(0,0,0,0.15)` | 14% |

---

## Entity: State Layer Token

### Purpose
Define interaction state overlay opacities

### Schema

```typescript
interface M3StateLayer {
  state: 'hover' | 'focus' | 'pressed' | 'dragged' | 'disabled';
  opacity: number;
}
```

### Values

| State | Opacity | CSS Value |
|-------|---------|-----------|
| Hover | 8% | 0.08 |
| Focus | 12% | 0.12 |
| Pressed | 12% | 0.12 |
| Dragged | 16% | 0.16 |
| Disabled | 38% (content) | 0.38 |

---

## Entity: Spacing Token

### Purpose
Define M3 spacing system based on 4px grid

### Values

| Token | Value | Use Case |
|-------|-------|----------|
| `space-0` | 0px | Reset |
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Compact elements |
| `space-3` | 12px | Default gaps |
| `space-4` | 16px | Section spacing |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Large gaps |
| `space-8` | 32px | Section separation |
| `space-10` | 40px | Layout margins |
| `space-12` | 48px | Touch target size |

---

## Entity: Border Radius Token

### Purpose
Define M3 shape system for components

### Values

| Token | Value | Use Case |
|-------|-------|----------|
| `radius-none` | 0px | Sharp corners |
| `radius-xs` | 4px | Text fields, chips |
| `radius-sm` | 8px | Buttons |
| `radius-md` | 12px | Cards |
| `radius-lg` | 16px | Dialogs |
| `radius-xl` | 28px | FAB |
| `radius-full` | 9999px | Pills, circles |

---

## Relationships

```
M3 Theme
├── Color Scheme (Light/Dark)
│   ├── Primary Tones
│   ├── Secondary Tones
│   ├── Tertiary Tones
│   ├── Error Tones
│   └── Surface Tones
├── Typography Scale
│   ├── Display (L/M/S)
│   ├── Headline (L/M/S)
│   ├── Title (L/M/S)
│   ├── Body (L/M/S)
│   └── Label (L/M/S)
├── Elevation Levels (0-5)
├── State Layers
├── Spacing Grid (4px base)
└── Border Radii
```

---

## Validation Rules

1. **Contrast**: All text/background combinations must meet WCAG AA (4.5:1 normal, 3:1 large)
2. **Touch Target**: Interactive elements minimum 48x48px
3. **Spacing**: All values must be multiples of 4px
4. **Consistency**: Same token used for same purpose across components
