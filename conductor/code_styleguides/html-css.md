# HTML/CSS Styleguide

Standards for writing semantic, accessible, and maintainable HTML and CSS.

## HTML General Principles

- Use semantic elements
- Ensure accessibility (WCAG 2.1)
- Write valid markup
- Keep structure separate from style

## HTML Naming

| Element | Convention | Example |
|---------|------------|---------|
| IDs | kebab-case | `user-profile` |
| Classes | kebab-case or BEM | `card`, `card__header` |
| Data attributes | kebab-case | `data-user-id` |
| Custom elements | kebab-case | `user-card` |

## Semantic Structure

### Semantic Elements

```html
<!-- Use semantic elements over generic divs -->
<article>  <!-- Self-contained content -->
<section>  <!-- Thematic grouping -->
<aside>    <!-- Tangentially related content -->
<nav>      <!-- Navigation links -->
<header>   <!-- Introductory content -->
<footer>   <!-- Footer content -->
<main>     <!-- Main content (one per page) -->
<figure>   <!-- Self-contained media -->
```

## Accessibility

### ARIA Labels

```html
<!-- Add labels to interactive elements -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- Use aria-labelledby for complex labels -->
<section aria-labelledby="section-title">
  <h2 id="section-title">User Settings</h2>
</section>
```

### Forms

```html
<form>
  <div class="form-group">
    <label for="email">Email Address</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-describedby="email-hint"
    >
    <p id="email-hint" class="hint">We'll never share your email.</p>
  </div>
</form>
```

### Images

```html
<!-- Meaningful images need alt text -->
<img src="chart.png" alt="Sales increased 25% in Q4">

<!-- Decorative images use empty alt -->
<img src="decoration.svg" alt="">
```

## CSS / Tailwind CSS

### Tailwind-First Approach

This project uses **Tailwind CSS 4 + DaisyUI 5** as the primary styling approach. Prefer Tailwind utility classes over custom CSS.

```svelte
<!-- Good: Tailwind utilities -->
<div class="flex items-center gap-4 rounded-lg bg-base-200 p-6">
  <h2 class="text-2xl font-bold">Title</h2>
</div>

<!-- Good: DaisyUI components -->
<button class="btn btn-primary">Action</button>
<div class="card bg-base-100 shadow-xl">...</div>
```

### When to Use Custom CSS

- Complex animations not covered by Tailwind
- Scoped styles in Svelte `<style>` blocks for component-specific needs
- CSS custom properties for theme values beyond DaisyUI

### Responsive Design (Mobile-First)

```svelte
<!-- Tailwind responsive prefixes -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

## Quick Reference

| Aspect | Recommendation |
|--------|----------------|
| Styling | Tailwind CSS utilities first |
| Components | DaisyUI component classes |
| Custom CSS | Svelte scoped `<style>` blocks |
| Specificity | Keep low, avoid IDs for styling |
| Units | rem for fonts, px for borders |
| Layout | Flexbox/Grid via Tailwind |
| Responsive | Mobile-first with Tailwind breakpoints |
| !important | Avoid |
