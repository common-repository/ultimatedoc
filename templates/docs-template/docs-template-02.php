<div class="col-12 docs-template-two ">
    <div class="docs-wraper docs-templatetwo">
        <div class="card-top">
            <div class="template-thumbnail" >
            <?php 
                    if ( has_post_thumbnail() ) {
                        the_post_thumbnail();
                    }
                ?>
            </div>
        </div>
        <div class="card-bottom">
            <div class="card-content-title">
                <a href="<?php echo esc_url( get_the_permalink(  ) ) ?>">
                    <h1><?php echo get_the_title(); ?></h1>
                </a>
            </div>
            <div class="docs-article">
                <span class="docs-article-total">
                    <?php 
                    printf(
                    '%s %s', 
                    ultd__get_total_article(get_the_ID())   ,
                    esc_html__( 'Articles in this doc', 'ultimate-doc' )); 
                    
                ?> </span>
            </div>
        </div>
    </div>
</div>