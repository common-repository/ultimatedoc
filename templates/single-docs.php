<?php get_header();?>
<?php
$template = get_theme_mod( 'single_doc_template', 'template-01' );

// var_dump($template);
$class = 'ultd--container';

if ( 'template-01' == $template ) {
    $class = 'ultd--container-fluid';
}

while ( have_posts() ) {
    the_post();
    $idd      = get_the_ID();
    $doc_type = get_post_meta( $idd, 'doc_type', true );
    ?>
        <?php

    if ( 'article' == $doc_type ):
    ?>

                    <div class="<?php echo esc_attr( $class . ' ' . $template ) ?>" >
                        <div class="ultd--single-wrap">
                        <?php
$template = apply_filters( 'ultd__include_single_template', ULTD_DIR . 'templates/single-template/' . $template . '.php' );
    if ( $template ) {
        include $template;
    }
    ?>
                        </div><!-- .ultd--single-wrap -->
                    </div>
            <?php elseif ( 'doc' == $doc_type ):
        include ULTD_DIR . 'templates/sections.php';
    endif;?>
    <?php }?>
<?php get_footer();?>
