# SynAck: design

This file defines SynAck's visual identity. It is kept separate from the [README](README.md) to avoid bloating it.

**Legend**: items marked **Fixed** come from the project creator (screenshots and instructions) and are not up for discussion. Items marked **Proposal** are deductions or additions to be validated.

---

## 1. References

| File | Contents |
|---|---|
| `docs/design/ui-kit.png` | Primary / Secondary buttons and three switches |
| `docs/design/logo-dark.png` | Logo, dark "Ack" block |
| `docs/design/logo_pink.png` | Logo, pink "Ack" block |

![UI kit](docs/design/ui-kit.png)

![Logo, dark version](docs/design/logo-dark.png) ![Logo, pink version](docs/design/logo_pink.png)

## 2. Typography (Fixed)

A single family: **Space Mono**, in its four variants.

| Variant | Weight | Use |
|---|---|---|
| Regular | 400 | Body text, code |
| Bold | 700 | Headings, buttons, UI elements |
| Italic | 400 italic | Quotes, newly introduced terms |
| Bold Italic | 700 italic | Strong emphasis |

Rules:
- No other font in the interface, including the code editor (Monaco) and the course code blocks.
- Disable synthesized weights and italics (`font-synthesis: none`): only the four real variants are used.
- **Self-host** the fonts (for example via `next/font/google`, which serves them from our domain at build time): this avoids contacting Google on every visit (GDPR) and simplifies the CSP. To verify at kickoff.
- French accented characters must render in all four variants (Latin subset); test this as soon as the setup is in place.

**Proposal** (readability, since a monospace font is tiring over long texts): body text of 16 to 18 px, line height of about 1.6, line width limited to about 65 characters for courses and articles.

## 3. Colors (Fixed)

Exact values of the supplied palette, checked against the screenshots. **The main color is `primary-400` (`#FB84C3`).**

### Primary (pink)

| Tone | Value | Note |
|---|---|---|
| 950 | `#2B0519` | |
| 900 | `#470A2B` | |
| 800 | `#770D46` | |
| 700 | `#A71161` | |
| 600 | `#D11A7B` | |
| 500 | `#F656AB` | Primary button bevel |
| **400** | **`#FB84C3`** | **Main color**: Primary button background, pink "Ack" block |
| 300 | `#FDA3D2` | |
| 200 | `#FEC2E1` | Light switch knob |
| 100 | `#FFE0F0` | |
| 50 | `#FFF0F8` | Secondary button and switch background, "Ack" text |

### Neutral

| Tone | Value | Note |
|---|---|---|
| 950 | `#121011` | Text, outlines, logo "Syn", dark "Ack" block |
| 900 | `#1E1B1D` | |
| 800 | `#2E292C` | |
| 700 | `#453E42` | |
| 600 | `#5F565B` | |
| 500 | `#7F757B` | |
| 400 | `#A9A0A5` | Gray switch knob (inactive) |
| 300 | `#D1CACE` | Secondary button bevel |
| 200 | `#E6E1E4` | |
| 100 | `#F3F0F2` | Page background (light mode) |
| 50 | `#FAF8F9` | |
| 0 | `#FFFFFF` | |

The components' hard drop shadow is pure black `#000000` in the screenshots (outside the palette); the UI kit screenshot also measures a `#F2F2F2` page background, a negligible gap from `neutral-100`.

### Semantic colors

Three tones each: **100** (message background), **500** (accent, icon, fill), **900** (text on the 100 background).

| Role | 100 | 500 | 900 |
|---|---|---|---|
| Success | `#DCF7E8` | `#1FA463` | `#0F6B3F` |
| Warning | `#FFF1CC` | `#F5A524` | `#8A5A00` |
| Danger | `#FFE0E0` | `#E5484D` | `#A4202A` |
| Info | `#DDEBFF` | `#3B82F6` | `#1E4FB0` |

### Contrast (computed from these values)

| Combination | Ratio | Use |
|---|---|---|
| `neutral-950` on `primary-400` | 8.3:1 | Primary button text |
| `neutral-950` on `primary-50` | 17.2:1 | Secondary button text |
| `neutral-950` on `primary-500` | 6.2:1 | Text on the bevel or on hover |
| `primary-50` on `primary-400` | 2.1:1 | **Insufficient for text**: reserved for the logo (large size) |
| `neutral-0` on `primary-600` | 5.1:1 | Dark solid link or button, on a light background |
| `neutral-0` on `primary-700` | 7.3:1 | Same, higher contrast |
| `neutral-950` on semantic 500 | 4.8 to 9.3:1 | Text on success, warning, danger, info fills |
| semantic 900 on semantic 100 | 5.3 to 6.2:1 | Alert messages |
| `neutral-0` on `info-500` | 3.7:1 | **Insufficient**: prefer `neutral-950` on fills |

**Proposal**: on colored fills, always use `neutral-950` text, as on the kit's buttons.

## 4. Component style (Fixed)

The style is **neo-brutalist**: thick, almost-black outline; hard drop shadow offset down and to the right (no blur); darker colored bevel on the bottom and right edges; rounded corners.

### Primary button
- `primary-400` background, `neutral-950` outline, hard black shadow.
- `primary-500` bevel on the bottom and right edges.
- Text in Space Mono Bold, `neutral-950`.

### Secondary button
- `primary-50` background, same outline and shadow.
- `neutral-300` bevel on the bottom and right edges.
- Text in Space Mono Bold, `neutral-950`.

### Switches (three visible states)
- Pill-shaped track, `primary-50` background, `neutral-950` outline, hard shadow.
- Inner knob: `primary-400` (elongated), `primary-200` (round, centered), `neutral-400` (elongated).
- **Proposed** interpretation: pink = on, light pink = intermediate or hover, gray = disabled. To confirm.

### Starting values (Proposal)
The screenshots have no known scale: border, radius, shadow offset and bevel must be calibrated by visual comparison with the kit.

**Measured on `ui-kit.png`** (pixel scan, button 251 px high): outline 5.5 px, hard shadow 12 px, bevel 11 px on both the bottom and the right edge, outer radius about 16 px. So, relative to the outline width `u`: **shadow = 2u, bevel = 2u, radius = 3u**. The implementation (`globals.css`, `.btn`) keeps these ratios with `u` = 2 px (sm, md) or 3 px (lg), and a fixed height per size. Live reference of every component: the `/design-system` page.

```css
:root {
  /* Primary */
  --primary-950: #2B0519;
  --primary-900: #470A2B;
  --primary-800: #770D46;
  --primary-700: #A71161;
  --primary-600: #D11A7B;
  --primary-500: #F656AB;
  --primary-400: #FB84C3; /* main color */
  --primary-300: #FDA3D2;
  --primary-200: #FEC2E1;
  --primary-100: #FFE0F0;
  --primary-50:  #FFF0F8;

  /* Neutral */
  --neutral-950: #121011;
  --neutral-900: #1E1B1D;
  --neutral-800: #2E292C;
  --neutral-700: #453E42;
  --neutral-600: #5F565B;
  --neutral-500: #7F757B;
  --neutral-400: #A9A0A5;
  --neutral-300: #D1CACE;
  --neutral-200: #E6E1E4;
  --neutral-100: #F3F0F2;
  --neutral-50:  #FAF8F9;
  --neutral-0:   #FFFFFF;

  /* Semantic */
  --success-100: #DCF7E8; --success-500: #1FA463; --success-900: #0F6B3F;
  --warning-100: #FFF1CC; --warning-500: #F5A524; --warning-900: #8A5A00;
  --danger-100:  #FFE0E0; --danger-500:  #E5484D; --danger-900:  #A4202A;
  --info-100:    #DDEBFF; --info-500:    #3B82F6; --info-900:    #1E4FB0;

  /* Roles (light mode) */
  --bg: var(--neutral-100);
  --ink: var(--neutral-950);
  --shadow: #000000;

  /* Shape (to calibrate) */
  --border: 3px;
  --radius: 12px;
  --shadow-offset: 6px;
}

.btn {
  font-family: "Space Mono", monospace;
  font-weight: 700;
  color: var(--ink);
  border: var(--border) solid var(--ink);
  border-radius: var(--radius);
  box-shadow:
    var(--shadow-offset) var(--shadow-offset) 0 var(--shadow),
    inset -3px -6px 0 var(--bevel);
}
.btn-primary   { background: var(--primary-400); --bevel: var(--primary-500); }
.btn-secondary { background: var(--primary-50);  --bevel: var(--neutral-300); }
```

### States and interactions (Proposal, absent from the screenshots)
- **Hover**: the button shifts slightly down and to the right and the shadow shrinks.
- **Press**: the button "sinks" (shadow to zero, shift equal to the shadow offset).
- **Keyboard focus**: an extra visible outline (for example a `primary-600` ring), so focus does not depend on hover.
- **Disabled**: `neutral-200` background, `neutral-300` bevel, `neutral-500` text, reduced or removed shadow.
- **Inline links**: `primary-600` or `primary-700` on a light background (sufficient contrast), not `primary-400`.

## 5. Logo (Fixed)

**"SynAck"** wordmark in two parts:
- **"Syn"**: `neutral-950` letters, no background.
- **"Ack"**: `primary-50` letters on a **rounded block**, `neutral-950` or `primary-400`.

The block evokes an acknowledgment (ACK) from the TCP handshake.

Two supplied variants: dark block (`logo-dark.png`) and pink block (`logo_pink.png`). Both have a transparent background.

Rules:
- Use the supplied files; do not retype the logo with the site font. The logo lettering appears proportional rather than monospace, so it differs from Space Mono.
- Keep a clear-space margin around the logo (at least the height of the "A").
- Do not change the colors, the spacing between "Syn" and the block, or the proportions.

### To produce (Proposal)
- **Vector version (SVG)**: the supplied files are 484 × 185 pixel PNGs, so not suitable for every size.
- **Dark mode variant**: on a dark background, "Syn" in `neutral-950` becomes invisible. A variant with light "Syn" (`primary-50` or `neutral-50`) and a pink "Ack" block is needed.
- **Favicon and app icon**: for example the "A" or "Ack" block alone, since the full word is too wide.
- **Share image** (Open Graph) with the logo, for SEO and social networks.

## 6. Dark mode (to design)

The screenshots only show light mode, but the `neutral` palette provides the needed tones. Dark mode remains planned (user's choice, see README). Problem: the black shadow is invisible on a dark background.

**Proposal** to validate:

| Role | Light mode | Dark mode |
|---|---|---|
| Page background | `neutral-100` | `neutral-950` |
| Surface (card) | `neutral-0` | `neutral-900` |
| Raised surface | `neutral-50` | `neutral-800` |
| Text | `neutral-950` | `neutral-50` |
| Outline | `neutral-950` | `neutral-50` |
| Hard shadow | `#000000` | `neutral-50` or `primary-400` (to test) |
| Primary button | `primary-400`, `neutral-950` text | same |
| Secondary button | `primary-50` background | `neutral-800` background, `neutral-50` text |

Logo: dark variant described in §5.

## 7. Theme colors (to decide)

The README provides for one tint per theme (programming, networking and protocols, tech watch), but the supplied palette only contains pink and neutrals.

**Proposal**: **pink stays the brand and action color** (buttons, links, logo). The three theme tints serve only as **accents** (course cards, badges, protocol animations) and follow the same recipe as pink:

| Role | Tone | Pink (reference) |
|---|---|---|
| Main fill | 400 | `#FB84C3` |
| Bevel | 500 | `#F656AB` |
| Light fill | 50 | `#FFF0F8` |
| Light knob | 200 | `#FEC2E1` |

The exact three tints are still to be chosen (see §9). A more restrained alternative: use only pink, neutrals and semantic colors in V1. In that case the semantic colors (`success`, `info`) can serve as occasional accents.

## 8. Technical integration

- The §4 tokens become **CSS variables** exposed to the Tailwind theme and to the shadcn/ui components (colors, radius, border, shadow). Names follow the supplied palette (`primary-400`, `neutral-950`, etc.) to stay aligned with the source design file.
- Roles (`--bg`, `--ink`, surface, border) are aliases that change between light and dark mode; components never use raw tones directly.
- shadcn/ui components (Button, Switch, Card, etc.) are **restyled** to follow §4 rather than replaced.
- A single `Logo` component with variants (dark, pink, dark mode) avoids duplicating files.
- Consistency with the CSP: self-hosted fonts, no external style resources.

## 9. Open points

- Confirm the interpretation of the three switch states
- Calibrate border, radius, shadow offset and bevel against the screenshots
- Validate dark mode (§6), notably the hard shadow color
- Choose the three theme tints, or drop them in V1 (§7)
- Produce the SVG logo, its dark variant, the favicon and the share image (§5)
- Define the other components in this style: input fields, cards, tabs, badges, alert messages (semantic colors), beta warning banner, code editor, protocol animations
- Check that Space Mono covers all needed characters (accents, code symbols) in the four variants
