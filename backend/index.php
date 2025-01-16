<?php

/**
 * Declare base directory and includes directory constants
 */

    define("BASE_DIR", __DIR__);
    define ("INCLUDES_DIR", BASE_DIR . '/includes' );

/**
 * Initialize PSR-4 autoloader for autoloading classes.
 */

    require_once INCLUDES_DIR . '/vendor/autoload.php';

/**
 * Load environment variables from .env file.
 */
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

/**
 * Load Remaining variable constants declarations.
 */

    require_once INCLUDES_DIR . '/constants.php';

/**
 * Check that site is secure in production environment (over HTTPS).  
 * If not, show error.  The SECURE constant variable will always be true in the development environment for testing.
 */

    if (!SECURE) {
        $insecure_msg = <<<HTML
            <h1>Error: Not secure</h1>
            </p>The current site is not secure over https and therefore the content will not be loaded.</p>
        HTML;
        http_response_code(403);
        exit($insecure_msg);
    }

/**
 * If SECURE constant variable is true, load application.
 */ 

    readfile(APP_FILE);
    exit;