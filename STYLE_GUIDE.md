# Mobile Libraries Website — Style Guide

This document defines the unified design system and visual conventions for the Mobile Libraries website. All design tokens, component overrides, and shared surface styles are centralized in [`src/theme.js`](./src/theme.js).

---

## 1. Colour Palette

The colour palette is derived from the **MobileLibraries ("Opposite the willow tree")** artwork and defined in `theme.palette`:

| Role | Token | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Page Canvas** | `palette.background.default` | `#FBF5E3` | Lighter warm cream main page background |
| **Card / Input Surface** | `palette.background.paper` | `#FFFFFF` | Pure white cards, search bar, dropdowns, and map overlays |
| **Subtle Surface** | `palette.background.subtle` / `palette.warmNeutral.cream` | `#F6EBC8` | Secondary chips, tracker header, attribution footer strip |
| **Warm Sand** | `palette.warmNeutral.sand` | `#E8D7A4` | Hover state for secondary chips |
| **Warm Brown** | `palette.warmNeutral.main` | `#9A5A22` | Map trip route lines and warm earthy accents |
| **Primary (Forest Green)** | `palette.primary.main` | `#3E6B2F` | Headings, primary buttons, active chips, links, and icons |
| **Primary Light (Soft Sage)** | `palette.primary.light` | `#6E9A5B` | Authority boundary map layers, subtle button fills, and soft outlines |
| **Primary Dark (Deep Forest)** | `palette.primary.dark` | `#264A1B` | Primary button and link hover states |
| **Secondary (Sunshine Yellow)** | `palette.secondary.main` | `#F2A91E` | Distance badges (`#1F3A18` dark green contrast text) |
| **Secondary Dark** | `palette.secondary.dark` | `#B97C00` | Active 60-second route section line on the map |
| **Tertiary (Rust)** | `palette.tertiary.main` | `#C4622D` | Map stop circles and selected stop pin |
| **Primary Text** | `palette.text.primary` | `#1F3A18` | Dark forest green body copy, stop names, and field values |
| **Secondary Text** | `palette.text.secondary` | `#4A5F43` | Muted olive green secondary metadata |

---

## 2. Typography

 Google Fonts (`Nunito` and `Nunito Sans`) are loaded in [`index.html`](./index.html) and configured in `theme.typography`:

- **Headings, Subtitles, Captions, Buttons, Chips & Links (`Nunito`)**:
  - `h1`–`h6`: `fontWeight: 800`, forest green (`primary.main`) for page headings (`h1`–`h4`) and dark green (`text.primary`) for card titles (`h5`–`h6`).
  - `subtitle1`, `subtitle2`, `caption`, `button`: `fontWeight: 700`.
- **Body Copy & Data Values (`Nunito Sans`)**:
  - `body1`, `body2`: `fontWeight: 400` (`600` for emphasized data values).
- **Detail Field Hierarchy (`theme.custom.fieldLabel` & `theme.custom.fieldValue`)**:
  - Labels (`Address`, `Frequency`, `Stop time`, `Access`, `Mobile library`, `Routes`) use `theme.custom.fieldLabel` (`color: primary.main`, `fontWeight: 800`, `0.78rem`).
  - Values use `theme.custom.fieldValue` (`color: text.primary`, `fontWeight: 600`, `0.92rem`) for high contrast and legibility.

---

## 3. Shape, Outlines & Surfaces

- **Single Uniform Corner Radius (`8px`)**:
  - `theme.shape.borderRadius` is set to `8` (`8px`).
  - Every button, card, chip, input, menu, dialog, and the map container uses this single `8px` radius (`borderRadius: 1` in MUI `sx`, or `theme.shape.borderRadius` in style overrides).
- **No Thin 1px Borders & No Borders Within Borders**:
  - Cards (`MuiCard`), dropdown menus (`MuiMenu`), and buttons (`MuiButton`) have **no borders** (`border: 'none'`). They rely on clean colour blocks against the `#FBF5E3` warm cream canvas.
  - Child controls inside a bordered container (such as the full-width top bar inside the map frame) are docked flush (`top: 0, left: 0, right: 0, borderRadius: 0`) with a translucent light background (`theme.custom.mapTopBar`) rather than drawing a second inner border.
- **Soft Complementary Outlines (`theme.custom.outline`)**:
  - Where an outline is needed to frame a primary interactive area (the search text box and the map container), use `theme.custom.outline` (`2px solid alpha(palette.primary.light, 0.3)`), transitioning to `theme.custom.outlineHover` on hover and `theme.custom.outlineFocus` (`2px solid palette.primary.light`) on focus.
- **Flat Surfaces**:
  - Controls, menus, dialogs, and map overlays use no box shadows or elevation; this is enforced centrally by the theme shadow palette and component overrides.

---

## 4. Buttons, Icons & Dropdowns

- **Flat Block Buttons (`MuiButton`)**:
  - **Primary (`variant="contained"`)**: Solid forest green (`#3E6B2F`) with white text, darkening to `#264A1B` on hover.
  - **Secondary / Action (`variant="outlined"`)**: Borderless block with a soft sage fill (`alpha(palette.primary.light, 0.14)`) and forest green text/icon, deepening to `alpha(palette.primary.light, 0.24)` on hover.
- **Icons**:
  - Use `*Rounded` Material icons (`@mui/icons-material/*Rounded`) across the entire interface.
  - Inline search bar icons use `theme.custom.iconBadge` (`32×32`, `8px` radius, `alpha(palette.primary.main, 0.1)` background, `palette.primary.main` icon colour).

---

## 5. External Links Convention

- **Reusable `ExternalLink` Component ([`src/ExternalLink.jsx`](./src/ExternalLink.jsx))**:
  - External links are always displayed as bold link text (`Nunito`, `fontWeight: 800`, `color: primary.main`) rather than buttons.
  - Use `<ExternalLink href="...">` from [`src/ExternalLink.jsx`](./src/ExternalLink.jsx) for all external links. It wraps Material UI's `<Link>` with `target="_blank"`, `rel="noopener noreferrer"`, and an inline `<OpenInNewRounded />` Material icon.
  - In Markdown pages ([`src/MarkdownPage.jsx`](./src/MarkdownPage.jsx)), `http://` and `https://` links automatically render via `<ExternalLink>`, while `mailto:` links render via `<Link>`.
