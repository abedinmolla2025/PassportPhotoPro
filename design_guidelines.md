# Design Guidelines: Photo Passport & Background Editor

## Design Approach

**Selected Framework:** Design System Approach (Material Design principles)
**Reference Inspiration:** Canva, remove.bg, Photopea - professional web-based editing tools

**Justification:** This is a utility-focused application where efficiency, clarity, and usability are paramount. Users need intuitive controls, clear visual feedback, and professional results. A systematic design approach ensures consistency across complex editing features.

## Core Design Principles

1. **Clarity Over Decoration** - Every interface element serves a functional purpose
2. **Instant Visual Feedback** - All edits show real-time previews
3. **Progressive Disclosure** - Advanced tools available but not overwhelming
4. **Professional Polish** - Clean, modern aesthetic that builds trust

## Typography System

**Font Family:** Inter (Google Fonts) for interface, Roboto for data/numbers

**Hierarchy:**
- Tool Headers: 20px, semibold
- Section Labels: 14px, medium
- Button Text: 14px, medium
- Helper Text: 12px, regular
- Measurements/Specs: 11px, monospace (Roboto Mono)

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16 (p-2, m-4, gap-6, etc.)

**Application Structure:**
```
┌─────────────────────────────────────┐
│  Top Bar: Logo + Export + Help      │ (h-16)
├─────────┬───────────────────────────┤
│  Tools  │  Canvas Preview Area      │
│  Panel  │  (Centered workspace)     │
│  (280px)│                           │
│         │  Before/After Slider      │
└─────────┴───────────────────────────┘
```

**Responsive Breakpoints:**
- Mobile: Collapsible bottom sheet for tools (full-width canvas)
- Tablet: Side drawer for tools (can be toggled)
- Desktop: Fixed left sidebar (always visible)

**Key Spacing:**
- Panel padding: p-6
- Tool sections gap: space-y-6
- Canvas margins: mx-auto with max-w-6xl
- Button groups gap: gap-3

## Component Library

### Primary Components

**Upload Zone:**
- Large centered dropzone (min-h-96 on empty state)
- Dashed border with rounded-xl
- Icon + "Drag photo here or click to browse" text
- Accepted formats badge (JPG, PNG - max 10MB)
- Thumbnail preview after upload with replace option

**Canvas/Preview Area:**
- Centered image display with zoom controls
- Checkered background pattern for transparency
- Dimension overlay in corner (e.g., "2000 x 1500 px")
- Crop overlay with adjustable handles when passport tool active
- Before/after slider (vertical divider, draggable handle)

**Tools Sidebar (Left Panel):**

1. **Passport Size Selector**
   - Dropdown with standard presets: "35x45mm (EU)", "2x2 inches (US)", "51x51mm (India)", Custom
   - Visual aspect ratio indicator
   - DPI selector (300 recommended)

2. **Background Tools**
   - "Remove Background" button (primary action)
   - Loading state with progress indicator
   - Color picker section with preset swatches (6-8 colors in grid)
   - Custom color input with hex code
   - "Reset to Original" option

3. **Advanced Adjustments** (Collapsible Section)
   - Brightness slider (-100 to +100)
   - Contrast slider (-100 to +100)
   - Saturation slider (-100 to +100)
   - Each with numeric value display and reset icon

4. **Crop & Rotate**
   - Preset aspect ratios buttons
   - Rotate 90° left/right buttons
   - Flip horizontal/vertical options

**Action Buttons:**
- Primary: Large "Download Photo" button (bottom of sidebar, full-width)
- Format selector: Radio group (JPEG/PNG)
- Quality slider for JPEG (80-100%)
- Secondary: "Start Over" button (outline style)

### Form Elements

**Sliders:**
- Track height: h-2, rounded-full
- Thumb: w-5 h-5, rounded-full, with shadow
- Value display inline (right-aligned)

**Buttons:**
- Primary: px-6 py-3, rounded-lg, font-medium
- Secondary: px-4 py-2, rounded-lg, border-2
- Icon buttons: w-10 h-10, rounded-lg (for rotate, flip)
- Button groups: flex gap-2

**Color Swatches:**
- Grid: grid-cols-4 gap-2
- Each swatch: w-12 h-12, rounded-lg, border-2
- Selected state: ring-2 ring-offset-2

**Dropdowns:**
- Full-width in sidebar
- Item height: h-10
- Rounded-lg with subtle shadow on open

### Navigation

**Top Bar (Fixed):**
- Logo/Brand (left) - h-8 w-auto
- Action buttons (right): "Export", "Help" icons
- Divider line at bottom (border-b)

**Mobile Navigation:**
- Hamburger menu for tools
- Bottom sheet slides up with tools
- Canvas takes full viewport minus header

### Data Display

**Image Info Card:**
- Compact display above canvas
- Shows: Filename, Dimensions, File size
- Edit/Delete icons (right-aligned)

**Processing States:**
- Spinner overlays for background removal
- Progress bar for upload
- Success/error toast notifications (top-right, auto-dismiss)

### Overlays

**Loading State:**
- Semi-transparent overlay on canvas
- Centered spinner with "Processing..." text
- Prevents interaction during operations

**Tooltips:**
- Appear on icon button hover
- Small, rounded, with arrow pointer
- Positioned contextually (above/below)

## Icons

**Library:** Heroicons (CDN)
- Upload: cloud-arrow-up
- Download: arrow-down-tray
- Crop: scissors
- Rotate: arrow-path
- Settings: adjustments-horizontal
- Help: question-mark-circle
- Close: x-mark
- Check: check

## Images Section

**No hero images required** - this is a utility application, not a marketing page. The interface is tool-focused with the user's uploaded photo being the primary visual content.

**Placeholder states:**
- Empty upload zone: Simple icon illustration (not photograph)
- Example dimensions: Small thumbnail icons showing passport photo examples

## Accessibility

- All sliders: keyboard navigable, aria-labels with current values
- Color contrast meets WCAG AA for all text
- Focus indicators: ring-2 ring-offset-2 on all interactive elements
- Screen reader announcements for processing states
- Alt text for all icons

## Animations

**Minimal, Functional Only:**
- Fade-in for canvas image load (150ms)
- Slide transitions for mobile tool panel (200ms ease-out)
- Smooth value updates on slider drag (no animation, instant feedback)
- Progress indicators: indeterminate spinner, no elaborate animations