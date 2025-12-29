<?php
/**
 * Formatho Theme Functions
 *
 * @package Formatho
 * @since 1.0.0
 */

/**
 * Theme setup
 */
function formatho_setup() {
    // Add theme support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 48,
        'width'       => 48,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Add theme support for title tag
    add_theme_support('title-tag');

    // Add theme support for post thumbnails
    add_theme_support('post-thumbnails');

    // Add theme support for HTML5 markup
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add theme support for automatic feed links
    add_theme_support('automatic-feed-links');

    // Register navigation menu
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'formatho'),
    ));

    // Set content width
    $GLOBALS['content_width'] = 1200;
}
add_action('after_setup_theme', 'formatho_setup');

/**
 * Enqueue scripts and styles
 */
function formatho_scripts() {
    // Enqueue theme stylesheet
    wp_enqueue_style('formatho-style', get_stylesheet_uri(), array(), '1.0.0');

    // Enqueue comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'formatho_scripts');

/**
 * Register widget areas
 */
function formatho_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'formatho'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here.', 'formatho'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'formatho_widgets_init');

/**
 * Custom logo fallback
 */
function formatho_custom_logo_fallback() {
    if (!has_custom_logo()) {
        $logo_url = 'https://formatho.com/logo.png';
        ?>
        <a href="<?php echo esc_url(home_url('/')); ?>" class="custom-logo-link" rel="home">
            <img src="<?php echo esc_url($logo_url); ?>" alt="<?php bloginfo('name'); ?>" class="custom-logo" />
        </a>
        <?php
    }
}

/**
 * Add custom body classes
 */
function formatho_body_classes($classes) {
    $classes[] = 'formatho-theme';
    
    // Add class if sidebar is active
    if (is_active_sidebar('sidebar-1')) {
        $classes[] = 'has-sidebar';
    }
    
    return $classes;
}
add_filter('body_class', 'formatho_body_classes');

/**
 * Custom excerpt length
 */
function formatho_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'formatho_excerpt_length');

/**
 * Custom excerpt more
 */
function formatho_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'formatho_excerpt_more');

/**
 * Add custom logo to header
 */
function formatho_header_logo() {
    if (has_custom_logo()) {
        the_custom_logo();
    } else {
        formatho_custom_logo_fallback();
    }
}
