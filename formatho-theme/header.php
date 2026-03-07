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
                <span class="site-description"><?php bloginfo('description'); ?></span>
            </div>
        </div>

        <nav class="main-navigation">
            <ul class="nav-menu">
                <li><a href="https://formatho.com/tools/">Home</a></li>
                <li><a href="https://formatho.com/tools/about">About Us</a></li>
                <li class="menu-item-has-children">
                    <a href="https://formatho.com/tools/">Tools</a>
                </li>
                <li>
                    <a href="https://github.com/nnn-gif/tools" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                            <path d="M9 18c-4.51 2-5-2-7-2"/>
                        </svg>
                        GitHub
                    </a>
                </li>
                <li class="current-menu-item"><a href="<?php echo esc_url(home_url('/')); ?>">Blog</a></li>
            </ul>
        </nav>
    </div>
</header>

<main id="main" class="site-main">
    <div class="site-content" style="padding: 0; max-width: 100%;">
