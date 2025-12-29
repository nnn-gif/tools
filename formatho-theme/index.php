<?php
/**
 * The main template file
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

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
                    <?php
                    if (is_singular()) {
                        the_title('<h1 class="entry-title">', '</h1>');
                    } else {
                        the_title('<h2 class="entry-title post-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                    }
                    ?>
                    
                    <?php if (!is_singular()) { ?>
                        <div class="entry-meta post-meta">
                            <span class="posted-on">
                                <?php echo get_the_date(); ?>
                            </span>
                        </div>
                    <?php } ?>
                </header>

                <?php if (has_post_thumbnail() && !is_singular()) { ?>
                    <div class="post-thumbnail">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('large'); ?>
                        </a>
                    </div>
                <?php } ?>

                <div class="entry-content <?php echo is_singular() ? 'post-content' : 'post-excerpt'; ?>">
                    <?php
                    if (is_singular()) {
                        the_content();
                        
                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('Pages:', 'formatho'),
                            'after'  => '</div>',
                        ));
                    } else {
                        the_excerpt();
                        ?>
                        <a href="<?php the_permalink(); ?>" class="button"><?php _e('Read More', 'formatho'); ?></a>
                        <?php
                    }
                    ?>
                </div>

                <?php if (is_singular()) { ?>
                    <footer class="entry-footer">
                        <div class="entry-meta">
                            <span class="posted-on">
                                <?php _e('Published on', 'formatho'); ?> <?php echo get_the_date(); ?>
                            </span>
                            <?php
                            $categories = get_the_category();
                            if ($categories) {
                                ?>
                                <span class="cat-links">
                                    <?php _e('in', 'formatho'); ?> <?php the_category(', '); ?>
                                </span>
                                <?php
                            }
                            ?>
                        </div>
                    </footer>
                <?php } ?>
            </article>
            <?php
        }
        ?>
    </div>

    <?php
    // Pagination
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
            <p><?php _e('It seems we can\'t find what you\'re looking for.', 'formatho'); ?></p>
        </div>
    </article>
    <?php
}
?>

<?php
get_footer();
