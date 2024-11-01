<?php
/*
 *
 *  Register CSS
 *
 */

function fqv_register_script() {

    wp_enqueue_style( 'ultd--google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600', false );
    // Enqueue All css
    wp_enqueue_style( 'ultd--grid', ULTD_ASSETS_CSS . 'grid-css.css', array(), time() );
    wp_enqueue_style( 'dashicons' );
    wp_enqueue_style( 'ultd--frontend', ULTD_ASSETS_CSS . 'frontend.css', array(), time() );
    wp_style_add_data( 'ultd--frontend', 'rtl', 'replace' ); 


    // Enqueue All Js file

    wp_enqueue_script( 'jquery-masonry' );
    wp_enqueue_script( 'vue', 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js', [], time(), true );
    wp_enqueue_script( 'ultd--docs-core', ULTD_ASSETS_JS . 'ultimate-doc.js', array( 'jquery' ), ULTD_VERSION, true );
    wp_enqueue_script( 'ultd--ia', ULTD_ASSETS_JS . 'ia.js', array( 'vue', 'ultd--docs-core' ), ULTD_VERSION, true );

    wp_localize_script( 'ultd--docs-core', 'ultd__vars', [
        'nonce'   => wp_create_nonce( 'ultd--nonce' ),
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'pageID'  => get_the_ID(),
    ] );
};
add_action( 'wp_enqueue_scripts', 'fqv_register_script' );

function ultd__customizer_scripts() {

    wp_enqueue_style( 'ultd--grid', ULTD_ASSETS_CSS . 'grid.css', array(), time() );
    $customizer_css = '
    #customize-controls #customize-control-header_top h3 {margin-left: -12px!important;margin-right: -12px!important;}
    ';
    wp_add_inline_style( 'ultd--grid', $customizer_css );
}

add_action( 'customize_controls_enqueue_scripts', 'ultd__customizer_scripts' );

/*
 *
 *  Includes
 *
 */
// Load the Functions
// require_once ULTD_INC . 'license.php';

// $sdk_license = UltimateDoc\License::init(
//     'UltimateDoc', // The plugin name is used to manage internationalization
//     'https://grayic.com/plugintest', //Replace with the URL of your license server (without the trailing slash)
//     'ck_c293e33b48c85dd9ddef489a5d88adbb19f39108', //Customer key created in the license server
//     'cs_dcc061ded98d6817909ea261b468af7f351189c1', //Customer secret created in the license server
//     [], //Set an array of the products IDs on your license server (if no product validation is needed, send an empty array)
//     'ultd__license', //Set a unique value to avoid conflict with other plugins
//     'ultd--valid', //Set a unique value to avoid conflict with other plugins
//     5//How many days the valid object will be used before calling the license server
// );

// global $sdk_license;
if ( !class_exists( 'Finestics\Client' ) ) {
    require_once ULTD_INC . 'Finestics/Client.php';
}

$init_finestics = new Finestics\Client( 'UltimateDoc', 'UltimateDoc', ULTD_FILE );
$init_finestics->insights()->init();

require_once ULTD_INC . 'functions.php';
require_once ULTD_INC . 'Walker/ULTD_Walker.php';
if ( file_exists( ULTD_INC . 'Post_types.php' ) ) {
    require_once ULTD_INC . 'Post_types.php';
}
require_once ULTD_INC . 'Admin/Admin.php';
require_once ULTD_INC . 'Metabox.php';
require_once ULTD_INC . 'Admin/Ajax.php';
require_once ULTD_INC . 'Ajax.php';
require_once ULTD_INC . 'Manager.php';
require_once ULTD_INC . 'shortcode.php';
require_once ULTD_INC . 'Widgets.php';

// Load the Functions
if ( file_exists( ULTD_INC . 'option-style.php' ) ) {
    require_once ULTD_INC . 'option-style.php';
}

if ( file_exists( ULTD_LIB . 'kirki.php' ) ) {
    require_once ULTD_LIB . 'kirki.php';
}

// Load the Settings Options
if ( file_exists( ULTD_INC . 'customizer/config.php' ) ) {
    require_once ULTD_INC . 'customizer/config.php';
}

// Register and load the widget
function wpb_load_widget() {
    register_widget( 'Widget' );
}
add_action( 'widgets_init', 'wpb_load_widget' );

function cc_mime_types( $mimes ) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

function fix_svg_thumb_display() {
    echo '
	<style>
	td.media-icon img[src$=".svg"], img[src$=".svg"].attachment-post-thumbnail {
		width: 100% !important;
		height: auto !important;
	  }
	</style>
	';
}
add_action( 'admin_head', 'fix_svg_thumb_display' );

if ( !is_plugin_active( 'ultimatedoc-pro/ultimate-doc-pro.php' ) ) {
    ultd__set_missing_template_default();
}