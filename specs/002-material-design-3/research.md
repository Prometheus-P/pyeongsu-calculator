# Research: Material Design 3 Implementation

**Feature Branch**: `002-material-design-3`
**Research Date**: 2025-12-02

## Technical Context

### Current Stack
- **Framework**: Astro 4.x with React 18 Islands
- **Styling**: Tailwind CSS 3.4.x
- **Dark Mode**: `class` strategy via `tailwind.config.js`
- **Theme Toggle**: Existing `ThemeToggle.tsx` component using `useTheme` context

### Files Requiring Modification
| File | Purpose |
|------|---------|
| `tailwind.config.js` | M3 design tokens (colors, typography, spacing, elevation) |
| `src/styles/global.css` | CSS custom properties for M3 tokens, high contrast styles |
| `src/components/Calculator.tsx` | Apply M3 styles to inputs, buttons |
| `src/components/ThemeToggle.tsx` | Update to M3 state layers and icon |
| `src/layouts/BaseLayout.astro` | Theme toggle position, transition animations |

---

## Research Findings

### 1. M3 Color System with Seed Color #1976D2 (Blue)

**Decision**: Generate M3 palette from seed color #1976D2 using tonal palette algorithm

**Rationale**:
- #1976D2 (Material Blue 700) provides 4.5:1+ contrast on white backgrounds
- M3's tonal palette ensures consistent contrast across light/dark modes
- Blue conveys trust and professionalism for a financial/real estate tool

**Generated Palette**:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `primary` | #1976D2 | #90CAF9 |
| `on-primary` | #FFFFFF | #003258 |
| `primary-container` | #D1E4FF | #004881 |
| `on-primary-container` | #001D35 | #D1E4FF |
| `secondary` | #535F70 | #BBC7DB |
| `on-secondary` | #FFFFFF | #263141 |
| `secondary-container` | #D7E3F8 | #3C4858 |
| `on-secondary-container` | #101C2B | #D7E3F8 |
| `tertiary` | #6B5778 | #D7BDE4 |
| `on-tertiary` | #FFFFFF | #3D2948 |
| `surface` | #F8F9FF | #111418 |
| `on-surface` | #191C20 | #E1E2E9 |
| `surface-variant` | #DFE2EB | #42474E |
| `on-surface-variant` | #43474E | #C2C6CF |
| `outline` | #73777F | #8C9199 |
| `outline-variant` | #C3C6CF | #42474E |
| `error` | #BA1A1A | #FFB4AB |
| `on-error` | #FFFFFF | #690005 |

**Alternatives Considered**:
- Google Material Theme Builder: More complex, requires external tool
- Custom manual palette: Inconsistent contrast ratios

---

### 2. M3 Typography Scale (Tailwind Integration)

**Decision**: Extend Tailwind theme with M3 type scale using system fonts

**Rationale**:
- System fonts (sans-serif) maintain fast loading
- M3 scale provides clear visual hierarchy
- Tailwind's `fontSize` extension preserves existing utilities

**Typography Tokens**:

```javascript
fontSize: {
  'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
  'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
  'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],
  'headline-large': ['32px', { lineHeight: '40px', fontWeight: '400' }],
  'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '400' }],
  'headline-small': ['24px', { lineHeight: '32px', fontWeight: '400' }],
  'title-large': ['22px', { lineHeight: '28px', fontWeight: '400' }],
  'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
  'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],
  'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
  'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
  'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
  'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
}
```

---

### 3. M3 State Layers

**Decision**: Implement state layers using CSS `::before` pseudo-elements with opacity

**Rationale**:
- M3 specifies precise opacity values for interaction states
- Pseudo-elements avoid color mixing complexity
- Works with both light and dark themes

**State Layer Opacities**:
| State | Opacity |
|-------|---------|
| Hover | 8% (0.08) |
| Focus | 12% (0.12) |
| Pressed | 12% (0.12) |
| Dragged | 16% (0.16) |

**Implementation Pattern**:
```css
.m3-state-layer {
  position: relative;
  overflow: hidden;
}
.m3-state-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 150ms;
  pointer-events: none;
}
.m3-state-layer:hover::before { opacity: 0.08; }
.m3-state-layer:focus-visible::before { opacity: 0.12; }
.m3-state-layer:active::before { opacity: 0.12; }
```

---

### 4. M3 Elevation System

**Decision**: Use CSS custom properties for elevation levels

**Rationale**:
- M3 defines 6 elevation levels (0-5)
- CSS variables allow theme-aware shadows
- Dark mode uses lighter tint instead of shadow

**Elevation Tokens**:
```css
--md-sys-elevation-0: none;
--md-sys-elevation-1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
--md-sys-elevation-2: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
--md-sys-elevation-3: 0 1px 3px rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15);
--md-sys-elevation-4: 0 2px 3px rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15);
--md-sys-elevation-5: 0 4px 4px rgba(0,0,0,0.3), 0 8px 12px 6px rgba(0,0,0,0.15);
```

---

### 5. M3 Outlined Text Field

**Decision**: Custom implementation with M3 outlined style

**Rationale**:
- Outlined style selected in clarification
- Border color changes on focus/error states
- Label animation optional (simplified approach uses placeholder)

**Key Specifications**:
- Border: 1px outline color, 2px on focus
- Border radius: 4px
- Padding: 16px horizontal, 8px vertical (for 48px min-height)
- Focus: primary color border

---

### 6. High Contrast Mode Support

**Decision**: `prefers-contrast: more` media query with enhanced borders and text

**Rationale**:
- Respects system accessibility settings
- Minimal CSS addition
- Enhances outline and surface contrast

**Implementation**:
```css
@media (prefers-contrast: more) {
  :root {
    --md-sys-color-outline: #000000;
    --md-sys-color-on-surface: #000000;
  }
  .dark {
    --md-sys-color-outline: #FFFFFF;
    --md-sys-color-on-surface: #FFFFFF;
  }
}
```

---

### 7. Theme Toggle Positioning

**Decision**: Header right side, icon button with sun/moon

**Rationale**:
- Standard web pattern (Github, VS Code, etc.)
- Easy discovery
- Does not interfere with calculator UI

**Current Implementation**: `ThemeToggle.tsx` already in header right position
- Requires M3 state layer styling
- Update icons to use SVG instead of emoji for better accessibility

---

## Unresolved Items

None - all clarifications resolved.

## References

- [M3 Color System](https://m3.material.io/styles/color/overview)
- [M3 Typography](https://m3.material.io/styles/typography/type-scale-tokens)
- [M3 Elevation](https://m3.material.io/styles/elevation/overview)
- [M3 State Layers](https://m3.material.io/foundations/interaction/states/overview)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
