<?php
$section_icon = get_theme_mod( 'section_upload_icon' );
?>

<div class="col-xl-6 col-lg-6 col-md-6">
    <div class="wraper template-third">
        <div class="ultd--content-area">
            <div class="docs-title">
                <h1>
                    <?php if(!empty($section_icon)): ?>
                    <img src="<?php  echo esc_html( $section_icon ) ?>" alt="">

                    <?php else: ?>
                    <span class="dashicons dashicons-media-text"></span>
                    <?php endif; ?>

                    <?php echo get_the_title(); ?>
                </h1>
            </div>
            <div class="section-article-list">
                <ul>
                    <?php 
                        $first_child = fd_get_posts_children( get_the_ID(), 3 );
                        if ($first_child) {
                        foreach ( $first_child as $item ) {        
                    ?>
                    <li>
                        <span class="dashicons dashicons-arrow-right-alt2"></span>
                        <a href="<?php echo get_the_permalink( $item ) ?>"><?php echo get_the_title( $item ); ?></a>
                    </li>
                    <?php } } ?>

                </ul>
            </div>
            <div class="total-article">
                <span class="article-total"><?php 
                        $enable_article_count = ultd__get_option('article_enable_post_count', true);
                        $article_count_text = ultd__get_option('article_count_text', 'Articles');
                        $article_count_text_singular = ultd__get_option('article_count_text_singular', 'Article');
                        if($first_child && $enable_article_count){
                            $total_article = ultd__get_total_article(get_the_ID(), true);

                            if($total_article > 3){

                            printf('<a href="%s">%s %s %s</a>',
                             get_the_permalink( $first_child[0] ),
                             esc_html__( 'See all', 'ultimate-doc' ),
                             $total_article,
                             _nx( $article_count_text_singular, $article_count_text, $total_article , $total_article, 'ultimate-doc' )
                         ); 
                        }
                        }else{
                            printf('<span>%s</span>', 
                            esc_html_e( 'This doc has no article', 'ultimate-doc' )
                        );
                        }
                            
                ?> </span>
            </div>
        </div>
    </div>
</div>