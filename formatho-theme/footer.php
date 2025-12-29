<?php
/**
 * The footer template file
 *
 * @package Formatho
 * @since 1.0.0
 */
?>

    </div><!-- .site-content -->
</main><!-- .site-main -->

<footer class="site-footer" role="contentinfo">
    <div class="site-footer-inner">
        <p>
            &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 
            <?php _e('All rights reserved.', 'formatho'); ?>
        </p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
