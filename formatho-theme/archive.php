<?php
/**
 * The template for displaying archive pages
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

<header class="page-header">
    <?php
    the_archive_title('<h1 class="page-title">', '</h1>');
    the_archive_description('<div class="archive-description">', '</div>');
    ?>
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

                <?php if (has_post_thumbnail()) { ?>
                    <div class="post-thumbnail">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('large'); ?>
                        </a>
                    </div>
                <?php } ?>

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
            <p><?php _e('It seems we can\'t find what you\'re looking for.', 'formatho'); ?></p>
        </div>
    </article>
    <?php
}
?>

<?php
get_footer();
