# Quickstart: Material Design 3 Implementation

**Feature Branch**: `002-material-design-3`
**Created**: 2025-12-02

## Prerequisites

- Node.js 18+
- npm 9+
- Existing Astro + Tailwind CSS project

## Quick Verification

After implementation, run these commands to verify:

```bash
# Build check
npm run build

# Type check
npx astro check

# Run existing tests (should all pass)
npm run test:run
npm run test:e2e

# Lighthouse accessibility check
npx lighthouse http://localhost:4321 --only-categories=accessibility
```

## Implementation Overview

### Files to Modify

| File | Changes |
|------|---------|
| `tailwind.config.js` | Add M3 color, typography, spacing, elevation tokens |
| `src/styles/global.css` | Add CSS custom properties, state layer styles, high contrast |
| `src/components/Calculator.tsx` | Apply M3 input/button styles |
| `src/components/ThemeToggle.tsx` | M3 state layers, SVG icons |
| `src/layouts/BaseLayout.astro` | Theme transition animation |

### Key Token Implementation

#### 1. Tailwind Config Colors

```javascript
// tailwind.config.js
colors: {
  m3: {
    primary: 'var(--md-sys-color-primary)',
    'on-primary': 'var(--md-sys-color-on-primary)',
    'primary-container': 'var(--md-sys-color-primary-container)',
    'on-primary-container': 'var(--md-sys-color-on-primary-container)',
    secondary: 'var(--md-sys-color-secondary)',
    surface: 'var(--md-sys-color-surface)',
    'on-surface': 'var(--md-sys-color-on-surface)',
    outline: 'var(--md-sys-color-outline)',
    error: 'var(--md-sys-color-error)',
  }
}
```

#### 2. CSS Custom Properties

```css
/* src/styles/global.css */
:root {
  --md-sys-color-primary: #1976D2;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-surface: #F8F9FF;
  --md-sys-color-on-surface: #191C20;
  --md-sys-color-outline: #73777F;
}

.dark {
  --md-sys-color-primary: #90CAF9;
  --md-sys-color-on-primary: #003258;
  --md-sys-color-surface: #111418;
  --md-sys-color-on-surface: #E1E2E9;
  --md-sys-color-outline: #8C9199;
}
```

#### 3. M3 State Layer Mixin

```css
/* State layer base */
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
  transition: opacity 150ms ease;
  pointer-events: none;
}

.m3-state-layer:hover::before {
  opacity: 0.08;
}

.m3-state-layer:focus-visible::before {
  opacity: 0.12;
}

.m3-state-layer:active::before {
  opacity: 0.12;
}
```

#### 4. M3 Outlined Input

```css
.m3-outlined-input {
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 4px;
  padding: 16px;
  min-height: 48px;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  transition: border-color 150ms ease;
}

.m3-outlined-input:focus {
  border-color: var(--md-sys-color-primary);
  border-width: 2px;
  padding: 15px; /* Compensate for border width */
  outline: none;
}
```

## Validation Checklist

### Color Tokens
- [ ] Primary color #1976D2 applied to buttons and links
- [ ] Dark mode uses #90CAF9 for primary
- [ ] Surface colors change with theme
- [ ] Error state uses M3 error color

### Typography
- [ ] Headlines use M3 headline scale
- [ ] Body text uses body-medium (14px/20px)
- [ ] Labels use label-large (14px/20px/500)

### State Layers
- [ ] Buttons show 8% overlay on hover
- [ ] Focus shows 12% overlay
- [ ] Press shows 12% overlay

### Accessibility
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Touch targets minimum 48x48px
- [ ] High contrast mode increases outline visibility
- [ ] Theme toggle accessible via keyboard

### Dark Mode
- [ ] System preference detected on load
- [ ] Toggle switches theme smoothly (300ms)
- [ ] All components update colors
- [ ] No flash of wrong theme on refresh

## Test Commands

```bash
# Unit tests
npm run test:run

# E2E tests
npm run test:e2e

# Visual regression (if configured)
npm run test:e2e -- --update-snapshots

# Accessibility audit
npx lighthouse http://localhost:4321 --only-categories=accessibility --output=html --output-path=./lighthouse-report.html
```

## Troubleshooting

### Issue: Colors not updating in dark mode
**Solution**: Ensure CSS custom properties are defined inside both `:root` and `.dark` selectors.

### Issue: State layer not visible
**Solution**: Check that parent element has `position: relative` and `overflow: hidden`.

### Issue: Theme flash on page load
**Solution**: Verify inline script in `BaseLayout.astro` runs before body renders.

### Issue: High contrast not working
**Solution**: Test in browser with forced high contrast (Chrome DevTools > Rendering > Emulate CSS media feature prefers-contrast).

## Architecture Notes

### CSS Variable Strategy

All M3 tokens are defined as CSS custom properties for:
1. Runtime theme switching without rebuilding
2. Easy overrides in component styles
3. DevTools inspection and debugging

### Tailwind Integration

Tailwind `theme.extend` references CSS variables:
- Enables using `bg-m3-primary` utility classes
- Maintains Tailwind's JIT compilation benefits
- Allows existing Tailwind utilities to work alongside M3 tokens

### Component Styling Priority

1. Use Tailwind utilities with M3 token references where possible
2. Use `@apply` for complex component patterns
3. Use raw CSS only for pseudo-element state layers
