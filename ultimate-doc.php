<?php
/*
Plugin Name: UltimateDoc
Plugin URI: https://github.com/ashrafuddin765/ultimate-doc
Description: Ultimate-Doc plugin is a simple and clean design.
Version: 1.0.0
Author: wpgrids
Author URI: httsp://wpgrids.net
License: GPLv2
Text Domain: ultimate-doc
 */

if ( !defined( 'ABSPATH' ) ) {
    die;
}

//Set plugin version constant.
define( 'ULTD_VERSION', '1.1.0' );
define( 'ULTD_PLUGIN_NAME', 'UltimateDoc' );
define( 'ULTD_INC', plugin_dir_path( __FILE__ ) . 'inc/' );
define( 'ULTD_DIR', plugin_dir_path( __FILE__ ) . '' );
define( 'ULTD_DIR_LY', plugin_dir_path( __FILE__ ) . 'template/' );
define( 'ULTD_FILE', __FILE__ );
define( 'ULTD_TEMPLATE', plugin_dir_path( __FILE__ ) . 'templates/' );
define( 'ULTD_MAIN', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'ULTD_ASSETS_CSS', plugins_url( 'assets/css/', __FILE__ ) );
define( 'ULTD_ASSETS_JS', plugins_url( 'assets/js/', __FILE__ ) );
define( 'ULTD_ASSETS_ASSETS', plugins_url( 'assets/img/', __FILE__ ) );
define( 'ULTD_LIB', plugin_dir_path( __FILE__ ) . 'lib/' );

add_action( 'init', 'init' );
function init() {

    register_theme_directory( dirname( __FILE__ ) . '/templates' );

    ultd__update_exxisting_doc_type();
    ultd__redirec_section_to_article();
}

if ( file_exists( ULTD_MAIN . 'init.php' ) ) {
    require_once ULTD_MAIN . 'init.php';
}
