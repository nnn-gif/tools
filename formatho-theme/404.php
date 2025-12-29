<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

<article class="post">
    <header class="entry-header">
        <h1 class="entry-title"><?php _e('404 - Page Not Found', 'formatho'); ?></h1>
    </header>
    <div class="entry-content">
        <p><?php _e('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.', 'formatho'); ?></p>
        <p>
            <a href="<?php echo esc_url(home_url('/')); ?>" class="button"><?php _e('Go to Homepage', 'formatho'); ?></a>
        </p>
    </div>
</article>

<?php
get_footer();
