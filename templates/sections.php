
<?php get_header(); ?>
<?php
     $section_description = get_theme_mod( 'section_description', 'You can search for a question here. It will help you get the most common anwers easily.' );
     $secttiontemplate = get_theme_mod( 'section_select_template', 'section-template-01' );
     if ( 'section-template-01' ==  $secttiontemplate ){
        $gridclass = "col-12 col-xl-6";
    }
    elseif ( 'section-template-02' == $secttiontemplate ) {
        $gridclass = "col-12";
    }
    elseif ( 'section-template-02' == $secttiontemplate ) {
        $gridclass = "col-12 col-xl-6";
    }
    else {
        $gridclass = "col-12 col-xl-6";
    }
?>
<div class="docsectin-main">
    <div class="section-bg <?php echo esc_attr($secttiontemplate) ?>" >
        <div class="ultd--container">
            <div class="row">
                <div class="<?php echo esc_attr( $gridclass ); ?>">
                    <div class="section-header" >
                        <div class="section-title" >
                            <h1><?php echo esc_html( get_the_title()); ?></h1>
                        </div>
                        <div class="section-desc" >
                            <p><?php echo esc_html( $section_description ); ?></p>
                        </div>
                        <div class="section-search" >
                            <?php echo do_shortcode( '[ultd__search id='.get_the_ID().']' ); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php echo do_shortcode( '[ultd id='.get_the_ID().']' );?>
</div>

<?php get_footer(); ?>

