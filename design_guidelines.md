# Design Guidelines: Glassmorphic Scientific Calculator

## Design Approach
**Reference-Based**: Drawing from modern calculator apps (Windows Calculator, macOS Calculator) combined with glassmorphic design principles seen in iOS and modern design systems. The interface prioritizes clarity, precision, and visual sophistication.

## Core Design Elements

### Typography
- **Display Font**: Inter or SF Pro Display for calculator readouts
- **UI Font**: Inter or system-ui for buttons and labels
- **Hierarchy**:
  - Main display: 48px-64px, font-weight-300 (light, spacious)
  - Secondary display (expression): 18px-24px, font-weight-400
  - Button labels: 16px-18px, font-weight-500
  - Function labels: 14px, font-weight-400

### Layout System
**Spacing Units**: Tailwind units of 1, 2, 3, 4, 6, 8
- Button gaps: gap-2 to gap-3
- Container padding: p-6 to p-8
- Section spacing: space-y-4 to space-y-6

**Grid Structure**:
- Calculator centered in viewport (max-w-md mx-auto)
- Display area: Full width with p-6
- Button grid: 4-5 columns for standard functions, expandable to 6-7 for scientific mode
- Aspect ratios: Buttons should be roughly square (aspect-square or similar height/width)

### Glassmorphism Implementation
**Glass Effects**:
- Background: backdrop-blur-xl with bg-white/10 (dark mode base)
- Borders: border border-white/20
- Shadows: Multiple layers - shadow-2xl combined with custom shadow (0 8px 32px rgba(0,0,0,0.3))
- Inner glow: Subtle inset highlights using pseudo-elements

**Layering Strategy**:
- App container: Primary glass layer
- Display area: Deeper glass (bg-black/30, backdrop-blur-lg)
- Buttons: Lighter glass (bg-white/5 with border-white/10)
- Active operators: Enhanced glass (bg-white/15)

### Component Library

**Display Component**:
- Two-tier display: Expression history (top, smaller, muted opacity-60) + Current value (bottom, large)
- Right-aligned text (text-right)
- Monospace for numbers to maintain alignment
- Min-height to prevent layout shift

**Button Categories**:
1. **Number buttons** (0-9, decimal): Standard glass treatment, generous touch targets (min 60px height)
2. **Basic operators** (+, -, ×, ÷): Slightly emphasized with bg-white/10
3. **Scientific functions** (sin, cos, tan, log, etc.): Compact, organized in logical groups
4. **Special actions** (C, CE, DEL): Destructive actions with subtle red tint (bg-red-500/10)
5. **Equals button**: Hero treatment - larger or spanning two columns, emphasized glass effect

**Button States**:
- Default: Glass base with border
- Hover: bg-white/15, border-white/30
- Active/Pressed: bg-white/20, scale-95
- Current operator: Persistent bg-blue-500/20 state

**Mode Toggle**:
- Pill-shaped toggle for Standard/Scientific modes
- Glass container with sliding indicator
- Position: Top of calculator, centered or right-aligned

**History Panel** (Optional Enhancement):
- Slide-out panel from right side
- Shows calculation history
- Same glassmorphic treatment
- Scrollable list with recent calculations

### Layout Structure
```
Main Container (centered, max-w-md to max-w-lg)
├─ Mode Toggle (if scientific features present)
├─ Display Area (glass panel, p-6)
│  ├─ Expression history (small, muted)
│  └─ Current value (large, prominent)
├─ Button Grid (grid with gap-2 or gap-3)
│  ├─ Scientific functions row (if expanded)
│  ├─ Memory functions row (M+, M-, MR, MC)
│  ├─ Advanced operators row (√, x², π, e, etc.)
│  ├─ Number pad (3×3 grid + 0)
│  └─ Operation column (right side: +, -, ×, ÷, =)
```

### Animations
Use sparingly and subtly:
- Button press: `transition-all duration-150 ease-out` with scale-95 on active
- Display updates: Subtle fade-in for new values (opacity transition)
- Mode switching: Smooth height/width transitions (transition-all duration-300)
- Panel slide-ins: transform translateX with duration-300
- No elaborate entrance animations - instant load with subtle micro-interactions only

### Responsive Behavior
- Mobile (base): Single column, compact button grid (4 columns max)
- Tablet/Desktop (md:): Expanded grid (5-7 columns for scientific mode)
- Maintain touch-friendly button sizes across all viewports (min 52px tap targets)

## Images
**No images required** - This is a pure utility application where visual elements come from glassmorphic effects and typography. Background can use a subtle gradient or noise texture applied to the body/page background behind the glass calculator interface.