# WordPress Theme Setup Guide

This guide will help you match your WordPress site at `/insights/` to your main Formatho website's monochrome design.

## Option 1: Using WordPress Customizer (Easiest)

### Step 1: Add Custom Logo

1. Go to **WordPress Admin** > **Appearance** > **Customize**
2. Click on **Site Identity**
3. Click **Select Logo**
4. Upload your logo (`/public/logo.png` from your main site)
5. Set logo size to **48x48px** (or maintain aspect ratio)
6. Click **Publish**

### Step 2: Add Custom CSS

1. In **WordPress Customizer**, go to **Additional CSS**
2. Copy the entire contents of `wordpress-custom.css`
3. Paste it into the Additional CSS box
4. Click **Publish**

### Step 3: Update Site Title

1. In **Site Identity**, set:
   - **Site Title**: `Formatho`
   - **Tagline**: `Privacy-First Developer Tools` (optional)

## Option 2: Using a Child Theme (Recommended for Production)

### Step 1: Create Child Theme Directory

```bash
# On your server, navigate to WordPress themes directory
cd /path/to/wordpress/wp-content/themes/

# Create child theme directory
mkdir formatho-child
cd formatho-child
```

### Step 2: Create style.css

Create `style.css` with:

```css
/*
Theme Name: Formatho Child
Template: [your-parent-theme-name]
Version: 1.0.0
*/

@import url('../[parent-theme]/style.css');
```

### Step 3: Copy Custom Files

1. Copy `wordpress-custom.css` to the child theme directory
2. Copy `wordpress-functions.php` content to `functions.php` in child theme

### Step 4: Activate Child Theme

1. Go to **WordPress Admin** > **Appearance** > **Themes**
2. Find and activate **Formatho Child**

## Option 3: Modify Existing Theme (Quick Fix)

### Step 1: Add CSS to Theme

1. Go to **Appearance** > **Theme Editor**
2. Select your active theme
3. Open `style.css` or create a new file
4. Add the contents of `wordpress-custom.css` at the end
5. Click **Update File**

### Step 2: Add Logo Support

1. In **Theme Editor**, open `functions.php`
2. Add the code from `wordpress-functions.php`
3. Click **Update File**

## Customization Options

### Logo Path

If your logo is hosted on the main site, you can reference it directly:

```css
.site-header .custom-logo {
  content: url('https://formatho.com/logo.png');
}
```

### Color Adjustments

All colors are defined as CSS variables at the top of `wordpress-custom.css`. You can modify:

- `--formatho-bg`: Background color
- `--formatho-foreground`: Text color
- `--formatho-primary`: Primary accent color
- `--formatho-border`: Border color
- `--formatho-muted-text`: Secondary text color

### Typography

The theme uses the same system font stack as your main site:

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

## Header Structure

For best results, ensure your WordPress header structure matches:

```html
<header class="site-header">
  <div class="site-branding">
    <img src="/logo.png" alt="Formatho" class="custom-logo" />
    <h1 class="site-title">
      <a href="/">Formatho</a>
    </h1>
  </div>
  <nav class="main-navigation">
    <!-- Navigation menu -->
  </nav>
</header>
```

## Testing

1. Visit `https://formatho.com/insights/`
2. Check that:
   - Logo appears in header
   - Colors match main site (monochrome black/white)
   - Typography matches
   - Layout is consistent

## Troubleshooting

### Logo Not Showing

- Check logo path is correct
- Verify logo file exists at `/public/logo.png`
- Clear WordPress cache
- Check browser console for 404 errors

### Styles Not Applying

- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check CSS is properly enqueued
- Verify no conflicting styles in theme
- Check CSS syntax for errors

### Colors Not Matching

- Verify CSS variables are defined
- Check for theme-specific color overrides
- Ensure dark mode media query isn't interfering
- Test in incognito mode

## Additional Notes

- The CSS includes dark mode support via `@media (prefers-color-scheme: dark)`
- All spacing and typography match your main site's design system
- The theme is fully responsive
- Code blocks use monospace fonts matching your main site

## Support

If you need to customize further, refer to:

- `src/style.css` - Main site styles
- `branding/brand_guidelines.md` - Brand guidelines
- WordPress Codex for theme customization
