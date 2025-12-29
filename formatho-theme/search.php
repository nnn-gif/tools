<?php
/**
 * The template for displaying search results
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

<header class="page-header">
    <h1 class="page-title">
        <?php
        printf(
            __('Search Results for: %s', 'formatho'),
            '<span>' . get_search_query() . '</span>'
        );
        ?>
    </h1>
</header>

<?php
if (have_posts()) {
    ?>
    <div class="post-list">
        <?php
        while (have_posts()) {
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('post'); ?>>
                <header class="entry-header">
                    <?php the_title('<h2 class="entry-title post-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>'); ?>
                    
                    <div class="entry-meta post-meta">
                        <span class="posted-on">
                            <?php echo get_the_date(); ?>
                        </span>
                    </div>
                </header>

                <div class="entry-content post-excerpt">
                    <?php the_excerpt(); ?>
                    <a href="<?php the_permalink(); ?>" class="button"><?php _e('Read More', 'formatho'); ?></a>
                </div>
            </article>
            <?php
        }
        ?>
    </div>

    <?php
    the_posts_pagination(array(
        'mid_size'  => 2,
        'prev_text' => __('Previous', 'formatho'),
        'next_text' => __('Next', 'formatho'),
    ));
} else {
    ?>
    <article class="post">
        <header class="entry-header">
            <h1 class="entry-title"><?php _e('Nothing Found', 'formatho'); ?></h1>
        </header>
        <div class="entry-content">
            <p><?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'formatho'); ?></p>
            <?php get_search_form(); ?>
        </div>
    </article>
    <?php
}
?>

<?php
get_footer();
