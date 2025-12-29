<?php
/**
 * The template for displaying all pages
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

<?php
while (have_posts()) {
    the_post();
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('post'); ?>>
        <header class="entry-header">
            <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
        </header>

        <?php if (has_post_thumbnail()) { ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail('large'); ?>
            </div>
        <?php } ?>

        <div class="entry-content post-content">
            <?php
            the_content();
            
            wp_link_pages(array(
                'before' => '<div class="page-links">' . __('Pages:', 'formatho'),
                'after'  => '</div>',
            ));
            ?>
        </div>
    </article>
    <?php
}
?>

<?php
get_footer();
