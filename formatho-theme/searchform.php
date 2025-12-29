<?php
/**
 * The search form template
 *
 * @package Formatho
 * @since 1.0.0
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <label>
        <span class="screen-reader-text"><?php _e('Search for:', 'formatho'); ?></span>
        <input type="search" class="search-field" placeholder="<?php esc_attr_e('Search...', 'formatho'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
    </label>
    <button type="submit" class="search-submit button"><?php _e('Search', 'formatho'); ?></button>
</form>
