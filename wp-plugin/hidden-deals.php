<?php
/**
 * Plugin Name: Hidden Deals
 * Author: Assem Ali
 */

function my_react_plugin_assets() {
    // could use manifest.json for better cache busting in production, but hardcoding for simplicity here
    wp_enqueue_script(
        'my-react-app',
        plugins_url( '/build/assets/index-B62pkxM6.js', __FILE__ ),
        array(),
        '1.0',
        true
    );
    wp_enqueue_style(
        'my-react-app-css',
        plugins_url( '/build/assets/index-B5bkcojc.css', __FILE__ )
    );

    wp_localize_script('my-react-app', 'LISTINGS_CONFIG', array(
        'apiUrl' => get_option('hidden_deals_api_url', 'http://localhost:3000/api') // Default to localhost if not set,
    ));
}

function hidden_deals_load_admin_assets($hook) {
    // Only load on Hidden Deals admin page
    if ($hook !== 'toplevel_page_hidden-deals') {
        return;
    }

    my_react_plugin_assets();
}

add_action('admin_enqueue_scripts', 'hidden_deals_load_admin_assets');


/**
 * Register admin menu and page
 */
function hidden_deals_register_admin_menu() {
    add_menu_page(
        'Hidden Deals',                          // Page title
        'Hidden Deals',                          // Menu title
        'manage_options',                        // Capability
        'hidden-deals',                          // Menu slug
        'hidden_deals_admin_page',               // Function
        'dashicons-list-view',                   // Icon
        30                                       // Position
    );
}

add_action('admin_menu', 'hidden_deals_register_admin_menu');

/**
 * Render the admin page with React app
 */
function hidden_deals_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <div id="root"></div>
    </div>
    <?php
}


/**
 * Trigger the scrape via POST request to the API
 */
function hidden_deals_run_scraper() {
    $api_url = 'http://localhost:3000/api';
    $scrape_url = $api_url . '/scrape';

    $response = wp_remote_post($scrape_url, array(
        'method'      => 'POST',
        'blocking'    => false,
        'headers'     => array(
            'Content-Type' => 'application/json',
        ),
    ));

    // Log the result
    if (is_wp_error($response)) {
        error_log('Hidden Deals Scraper - Error: ' . $response->get_error_message());
    } else {
        $code = wp_remote_retrieve_response_code($response);
        error_log('Hidden Deals Scraper - Success: HTTP ' . $code);
    }
}

add_action('hidden_deals_scraper_hook', 'hidden_deals_run_scraper');

/**
 * Schedule the cron on plugin activation
 */
function hidden_deals_activate_plugin() {
    // Schedule twice daily (every 12 hours)
    if (!wp_next_scheduled('hidden_deals_scraper_hook')) {
        wp_schedule_event(time(), 'twicedaily', 'hidden_deals_scraper_hook');
    }
}

register_activation_hook(__FILE__, 'hidden_deals_activate_plugin');

/**
 * Clear the cron on plugin deactivation
 */
function hidden_deals_deactivate_plugin() {
    wp_clear_scheduled_hook('hidden_deals_scraper_hook');
}

register_deactivation_hook(__FILE__, 'hidden_deals_deactivate_plugin');