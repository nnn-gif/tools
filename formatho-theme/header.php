<?php
/**
 * The header template file
 *
 * @package Formatho
 * @since 1.0.0
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
    <div class="site-header-inner">
        <div class="site-branding">
            <?php formatho_header_logo(); ?>
            
            <div class="site-title-wrapper">
                <?php
                if (is_front_page() && is_home()) {
                    ?>
                    <h1 class="site-title">
                        <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                            <?php bloginfo('name'); ?>
                        </a>
                    </h1>
                    <?php
                } else {
                    ?>
                    <p class="site-title">
                        <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                            <?php bloginfo('name'); ?>
                        </a>
                    </p>
                    <?php
                }
                ?>
            </div>
        </div>

        <?php
        if (has_nav_menu('primary')) {
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container'      => 'nav',
                'container_class' => 'main-navigation',
                'menu_class'     => 'nav-menu',
                'fallback_cb'   => false,
            ));
        }
        ?>
    </div>
</header>

<main id="main" class="site-main">
    <div class="site-content">
