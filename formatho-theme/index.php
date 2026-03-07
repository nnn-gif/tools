<?php
/**
 * The main template file
 *
 * @package Formatho
 * @since 1.0.0
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-content">
        <h1 class="hero-title gradient-text">Insights</h1>
        <p class="hero-subtitle">Thoughts, tutorials, and updates from the Formatho team</p>
        <div class="hero-badges">
            <span class="badge">Tutorials</span>
            <span class="badge">Updates</span>
            <span class="badge">Tips & Tricks</span>
            <span class="badge">Privacy First</span>
        </div>
    </div>
</section>

<!-- Posts Grid -->
<section class="posts-section">
    <div class="posts-grid">
        <?php
        if (have_posts()) {
            while (have_posts()) {
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('post glass-card'); ?>>
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <!-- Icon -->
                        <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; margin-bottom: 1rem; padding: 0.75rem; background: rgba(0, 180, 216, 0.1); border-radius: 12px; color: var(--formatho-primary);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" x2="8" y1="13" y2="13"/>
                                <line x1="16" x2="8" y1="17" y2="17"/>
                                <line x1="10" x2="8" y1="9" y2="9"/>
                            </svg>
                        </div>

                        <!-- Title -->
                        <h3 class="post-title" style="margin-bottom: 0.5rem; transition: color 0.2s;">
                            <a href="<?php the_permalink(); ?>" style="text-decoration: none; color: inherit;">
                                <?php the_title(); ?>
                            </a>
                        </h3>

                        <!-- Excerpt -->
                        <p class="post-excerpt" style="flex: 1; margin-bottom: 1rem;">
                            <?php echo wp_trim_words(get_the_excerpt(), 20); ?>
                        </p>

                        <!-- Meta -->
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--formatho-muted-text);">
                            <span style="display: flex; align-items: center; gap: 0.25rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                    <line x1="16" x2="16" y1="2" y2="6"/>
                                    <line x1="8" x2="8" y1="2" y2="6"/>
                                    <line x1="3" x2="21" y1="10" y2="10"/>
                                </svg>
                                <?php echo get_the_date('M j, Y'); ?>
                            </span>
                            <a href="<?php the_permalink(); ?>" class="read-more-link">
                                Read more
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"/>
                                    <path d="m12 5 7 7-7 7"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
                <?php
            }
        } else {
            ?>
            <div class="no-posts" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h2 style="margin-bottom: 1rem;">No posts found</h2>
                <p style="color: var(--formatho-muted-text);">Check back soon for new content!</p>
            </div>
            <?php
        }
        ?>
    </div>

    <!-- Pagination -->
    <div class="pagination" style="max-width: 1400px; margin: 2rem auto; padding: 0 2rem; text-align: center;">
        <?php
        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
            'next_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        ));
        ?>
    </div>
</section>

<?php
get_footer();
