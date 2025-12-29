# Formatho WordPress Theme

A monochrome WordPress theme matching the Formatho developer tools website design.

## Features

- **Monochrome Design**: Clean black and white design matching the main Formatho site
- **Custom Logo Support**: Easy logo upload via WordPress Customizer
- **Responsive Layout**: Fully responsive design that works on all devices
- **Brand Typography**: Monospace font for site title matching the logo style
- **Clean Typography**: System font stack for body text and optimal readability
- **WordPress Block Editor Ready**: Compatible with Gutenberg blocks
- **SEO Friendly**: Proper HTML structure and semantic markup

## Installation

1. Upload the `formatho-theme` folder to `/wp-content/themes/` directory
2. Go to **WordPress Admin** > **Appearance** > **Themes**
3. Activate the **Formatho** theme

## Setup

### Logo

1. Go to **WordPress Admin** > **Appearance** > **Customize**
2. Click on **Site Identity**
3. Click **Select Logo** and upload your logo
4. Recommended size: 48x48px (or maintain aspect ratio)
5. Click **Publish**

### Menu

1. Go to **WordPress Admin** > **Appearance** > **Menus**
2. Create a new menu or edit existing
3. Add items to your menu
4. Under **Display location**, check **Primary Menu**
5. Click **Save Menu**

### Widgets

1. Go to **WordPress Admin** > **Appearance** > **Widgets**
2. Add widgets to the **Sidebar** area
3. Widgets will appear in the sidebar on posts and pages

## Customization

All colors are defined as CSS variables in `style.css`. You can customize:

- `--formatho-bg`: Background color
- `--formatho-foreground`: Text color
- `--formatho-primary`: Primary accent color
- `--formatho-border`: Border color
- `--formatho-muted-text`: Secondary text color

## Template Files

- `index.php` - Main blog template
- `single.php` - Single post template
- `page.php` - Page template
- `archive.php` - Archive template
- `search.php` - Search results template
- `404.php` - 404 error page template
- `header.php` - Header template
- `footer.php` - Footer template
- `sidebar.php` - Sidebar template

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

GPL v2 or later

## Credits

Theme designed to match the Formatho developer tools website.
