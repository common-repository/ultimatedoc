<?php
    $first_child = fd_get_posts_children(get_the_ID(  ));
?>

<div class="col-12">

    <a href="<?php echo get_the_permalink(  ) ?>">
        <div class="wraper template-scnd">
            <div class="icon scnd-icon">
                <?php 
            if ( has_post_thumbnail() ) {
                the_post_thumbnail();
            }
        ?>
            </div>
            <div class="ultd--content-area">
                <div class="docs-title">
                    <h1><?php echo get_the_title(); ?></h1>

                </div>
                <div class="total-article">
                    <span class="article-total">
                        <?php 
                $enable_article_count = ultd__get_option('article_enable_post_count', true);
                $article_count_text = ultd__get_option('article_count_text', 'Articles');
                $article_count_text_singular = ultd__get_option('article_count_text_singular', 'Article');
                if($first_child && $enable_article_count){
                    $total_article = ultd__get_total_article(get_the_ID(), true);
                    printf(
                    '%s %s', 
                    $total_article,
                    _nx( $article_count_text_singular, $article_count_text, $total_article , $total_article, 'ultimate-doc' )
                ); 
                }else{
                    esc_html_e( 'This doc has no article', 'ultimate-doc' );

                }
                ?> </span>
                </div>
            </div>
        </div>
    </a>
</div>