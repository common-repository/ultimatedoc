
<div class="col-xl-4 col-lg-4 col-md-6" >
    <div class="docs-wraper" >
        <div class="card-top">
            <div class="card-title">
                <?php 
                
                    if ( has_post_thumbnail() ) {
                        the_post_thumbnail();
                    }
                ?>
            
            </div>
        </div>
        <div class="card-bottom">
            <div class="card-content-title">
                <h1><?php echo get_the_title(); ?></h1>
            </div>
            <div class="card-content">
                <p><?php 
                echo esc_html(wp_trim_words( get_the_excerpt(),15)); ?></p>
            </div>
            <div class="card-button">
                <a href="<?php echo esc_url( get_the_permalink(  ) ) ?>"><?php _e( 'Read the doc', 'ultimate-doc' ) ?> </a>
            </div>
        </div>
    </div>
</div>
   