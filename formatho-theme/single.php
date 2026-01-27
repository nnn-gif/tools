<?php
/**
 * The template for displaying single posts
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

        <footer class="entry-footer">
            <?php
            $tags = get_the_tags();
            if ($tags) {
                ?>
                <div class="tags-links">
                    <?php _e('Tags:', 'formatho'); ?> <?php the_tags('', ', ', ''); ?>
                </div>
                <?php
            }
            ?>
        </footer>
    <?php
    // Post navigation
    the_post_navigation(array(
        'prev_text' => '<span class="nav-subtitle">' . __('Previous:', 'formatho') . '</span> <span class="nav-title">%title</span>',
        'next_text' => '<span class="nav-subtitle">' . __('Next:', 'formatho') . '</span> <span class="nav-title">%title</span>',
    ));

    // Comments
    if (comments_open() || get_comments_number()) {
        comments_template();
    }
    ?>
    </article>
    <?php } ?>

<?php
get_footer();
