# Sanctum Church Website — Codex Instructions

## Overview
This is a Vite + React + Tailwind CSS church website inspired by the **HAVEN** design system (as seen in the reference video). The aesthetic is:

- **Dark editorial luxury** — deep black (`#080808`) base, warm ember/crimson gradients
- **Typography-first** — Playfair Display (display serif) + EB Garamond (body) + Cormorant SC (labels)
- **Bracket-style CTAs** — `(like this)` using italic font-label with border
- **Asymmetric editorial grids** — not centered layouts; offset columns, overlap, generous whitespace
- **Cinematic imagery** — silhouettes, divine light, arches, staircases, atmospheric glow
- **Scroll-triggered animations** — fade-up with IntersectionObserver, staggered delays

---

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## Design System Reference

### Colors (tailwind.config.js)
| Token | Value | Use |
|-------|-------|-----|
| `void` | `#080808` | Page background |
| `ash` | `#1a1a1a` | Alternate section bg |
| `bone` | `#F5F0E8` | Primary text |
| `ember-400` | `#fb923c` | Accent headlines |
| `ember-500` | `#f97316` | CTA borders |
| `ember-600` | `#ea580c` | CTA hover fills |
| `ember-700` | `#c2410c` | Glows, gradients |
| `ember-950` | `#431407` | Subtle bg tints |

### Typography
```
font-display  →  "Playfair Display"   (headings, editorial)
font-body     →  "EB Garamond"        (body copy, quotes)
font-label    →  "Cormorant SC"       (labels, CTAs, nav)
```

### Button Patterns
```jsx
// Bordered bracket CTA (neutral)
<button className="btn-bracket">(plan your visit)</button>

// Ember glow CTA (primary)
<button className="btn-bracket-glow">(join us)</button>
```

### Metadata Labels
```jsx
<span className="meta-label">Section Title</span>
// → Cormorant SC, xs, tracking-[0.25em], uppercase, bone/40
```

### Section Header Pattern
Every section starts with:
```jsx
<div className="flex items-center gap-6 mb-20">
  <span className="meta-label">Section Name</span>
  <div className="flex-1 h-px bg-bone/10" />
  <span className="meta-label">02 • 01</span>  {/* section index */}
</div>
```

---

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx         Sticky transparent → frosted on scroll, mobile (menu) toggle
│   ├── Hero.jsx           Full-screen ember gradient, CSS silhouette, cinematic headline
│   ├── About.jsx          12-col asymmetric grid, CSS cathedral arch illustration, stats
│   ├── DailyWord.jsx      Mobile card mockup + verse selector (interactive)
│   ├── Testimonials.jsx   Story cards with (prev)/(next) navigation
│   ├── FAQ.jsx            Accordion FAQ with ember + sign
│   └── Footer.jsx         Dramatic CTA + ember glow, bottom nav bar
├── App.jsx                Top-level composition
├── index.css              Tailwind base + custom component classes
└── main.jsx               Entry point
```

---

## Codex Tasks — What to Implement / Improve

### 1. Add Real Images
Replace the CSS gradient placeholders with actual images using `<img>` or CSS `background-image`. Suggested Unsplash queries:
- Hero: `https://unsplash.com/s/photos/cathedral-light-silhouette`
- About: `https://unsplash.com/s/photos/church-organ-architecture`
- Testimonials: `https://unsplash.com/s/photos/staircase-light-fog`

Image treatment: always dark-overlay with `mix-blend-mode: multiply` or `::after` overlay:
```jsx
<div className="relative overflow-hidden">
  <img src="..." className="w-full h-full object-cover" />
  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.9) 100%)' }} />
</div>
```

### 2. Add Smooth Scroll Cursor
Custom cursor — a small crosshair or dot that follows mouse:
```jsx
// In App.jsx, add a custom cursor component
// Use useEffect + mousemove listener
// Render a div with fixed positioning, transform: translate(x, y)
// Use cursor: none on body (already set in index.css)
```

### 3. Sermons Page / Section
Add a `/sermons` section or route with:
- Grid of sermon cards: title, speaker, date, duration
- Each card: dark bg, ember hover border, `(listen)` bracket CTA
- Video embed modal on click

### 4. Events Section
Grid layout:
```jsx
// 3-column grid, each event card:
// - Large date (day number in Playfair Display, huge, ember colored)
// - Month label (Cormorant SC, small-caps)
// - Event title in display serif
// - Location in meta-label
// - (register) bracket CTA
```

### 5. Give / Generosity Page
Minimalist centered layout:
- Large display quote about giving from scripture
- Simple amount selector (styled as bracket buttons, not a typical form)
- Ember gradient button for submit

### 6. Page Transitions
Add CSS transition between route changes:
```jsx
// Wrap page content in a div with:
// opacity: 0 → animation: fadeIn 0.6s ease forwards
// on route change: opacity out, change route, opacity in
```

### 7. Ambient Sound Toggle (optional)
Small audio toggle button in bottom-right:
- `(♪ ambience on/off)` bracket button
- Loop a soft organ/ambient track
- Smooth fade in/out with Web Audio API

---

## Animation Patterns

### Scroll-triggered fade-up (used in every section)
```jsx
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// Usage:
const [ref, inView] = useInView()
<div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
```

### Staggered children
```jsx
{items.map((item, i) => (
  <div
    key={i}
    className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    style={{ transitionDelay: `${i * 100}ms` }}
  >
```

---

## Ember Gradient Recipe
The signature gradient (used throughout):
```css
/* Full page radial glow from bottom */
background:
  radial-gradient(ellipse 80% 60% at 50% 110%, #c2410c 0%, #7c2d12 25%, transparent 60%),
  radial-gradient(ellipse 50% 40% at 50% 115%, #fbbf24 0%, transparent 40%),
  #080808;

/* Side ambient glow */
background: radial-gradient(circle, #c2410c, transparent);
filter: blur(120px);
opacity: 0.2;

/* Top section glow */
background: radial-gradient(ellipse at 50% 0%, #ea580c 0%, #9a3412 40%, #080808 75%);
```

---

## DO NOT
- Use Inter, Roboto, or system fonts anywhere
- Use purple/blue color schemes
- Use centered hero with plain gradient — always use radial ember from bottom or top
- Use standard card shadows (`shadow-md`) — use `box-shadow: 0 0 40px rgba(194,65,12,0.2)` for ember glow
- Use `rounded-xl` for CTA buttons — these are square-cornered by design
- Over-round images — use `overflow-hidden` with no border-radius or very subtle radius

---

## Brand Voice
- Name: **Sanctum** (replace with client's church name)
- Tagline: "A place of sacred encounter"
- Tone: Warm, unhurried, literary, non-preachy, inclusive
- Scripture style: Cite reference first (e.g., `Isaiah 41:10`), then verse
- CTA copy always in bracket format: `(join us)`, `(plan your visit)`, `(listen now)`
