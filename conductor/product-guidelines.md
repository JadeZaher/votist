# Votist - Product Guidelines

## Brand Voice & Tone

### Core Voice: Empowering & Bold
Votist speaks with conviction. The platform positions knowledge as power and treats civic participation as something earned and meaningful — not passive.

### Tone Principles
- **Empowering** — "The more you know, the more impact you have." Frame learning as gaining power, not homework
- **Direct & action-oriented** — Use imperative CTAs: "Start", "Vote for change", "Earn Voting Power"
- **Community-focused** — Reference specific communities (San Rafael) and their real challenges
- **Credibility-driven** — Emphasize that informed voices matter more than loud ones: "credibility is earned"

### Copy Guidelines
- Headlines should be bold and declarative: "Knowledge is Power — Your Power"
- Body text should connect civic issues to personal impact
- Avoid bureaucratic language; keep it accessible but substantive
- Use "you/your" to address the user directly

## Design Standards

### Visual Style: Bold & Engaging
- **Hero sections** with full-bleed background images and dark overlays for text contrast
- **Strong visual hierarchy** — Large headlines (text-5xl), clear CTAs with distinct colors
- **Primary accent:** Cyan/teal (#0891B2) for action buttons and interactive elements
- **Dark overlays** (brightness-50) on hero images for readability
- **Gamification elements** — Level indicators, progress roadmaps, achievement icons

### Component Patterns
- **DaisyUI** as the component foundation with Tailwind CSS utility classes
- **Card-based layouts** — CenterContentCTA, ImageTextSection, QuizFeatureCard patterns
- **Alternating image/text sections** (imageOnLeft toggle) for visual rhythm on landing pages
- **Rounded buttons** (rounded-md) with hover state transitions
- **Icon-enhanced CTAs** — Secondary buttons pair text with descriptive icons

### Spacing & Layout
- Generous padding (px-8, py-12) for breathing room
- Content constrained with max-w-2xl for readability
- Responsive with mobile-first approach
- Percentage-based margins (ml-[10%]) for hero content positioning

## Communication Style

- Error messages should be helpful and suggest next steps
- Success states should celebrate progress ("Quiz completed!" not just "Done")
- Loading states should feel purposeful, not dead
- Empty states should guide users toward their first action
