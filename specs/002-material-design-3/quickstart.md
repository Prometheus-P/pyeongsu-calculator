# Quickstart: Using M3 Design Tokens

This guide explains how to use the newly defined Material Design 3 (M3) tokens in Astro and React components.

## Color Tokens

Color tokens are accessed via standard Tailwind CSS utility classes, prefixed with `m3-`. The structure is hierarchical.

**Example**:
- To set a background to the primary color: `bg-m3-primary`
- To set text color for content on a primary background: `text-m3-primary-on`
- To use a surface container color: `bg-m3-surface-container`

```html
<!-- Primary button example -->
<button class="bg-m3-primary text-m3-primary-on">
  Submit
</button>

<!-- A card with a surface color -->
<div class="bg-m3-surface text-m3-surface-on">
  Card Content
</div>
```

## Typography Tokens

Typography tokens are also accessed via Tailwind utility classes. A single class applies font size, line height, and weight.

**Example**:
- To style a main headline: `text-m3-headline-large`
- To style a standard body text: `text-m3-body-large`

```html
<h1 class="text-m3-headline-large">Page Title</h1>
<p class="text-m3-body-large">This is a paragraph of text.</p>
```

## Elevation (Shadows)

Apply elevation using the `shadow-*` utility.

**Example**:
- To apply a level-2 shadow to a card: `shadow-m3-level-2`

```html
<div class="shadow-m3-level-2 rounded-lg p-4">
  A card with elevation.
</div>
```

## Spacing & Radius

Standard Tailwind utilities for spacing (`p-`, `m-`, `gap-`) and border-radius (`rounded-`) should be used with the M3 scale. The M3 tokens are configured to work with Tailwind's default spacing keys.

**Example**:
- M3 uses a 4px grid, so `p-4` gives `16px` of padding.
- For a medium border radius (12px): `rounded-m3-medium` (if defined) or the equivalent `rounded-xl`.

## State Layers

For interactive elements, apply the `.m3-state-layer` utility class (defined in `global.css`) in combination with Tailwind's state variants (`hover:`, `focus:`).

**Example**:
```html
<button class="relative overflow-hidden">
  <span class="z-10">Button Text</span>
  <div class="m3-state-layer absolute inset-0 bg-m3-primary opacity-0 hover:opacity-8 focus:opacity-12"></div>
</button>
```
*(Note: The exact implementation of state layers may vary, refer to the final component code for the canonical pattern.)*