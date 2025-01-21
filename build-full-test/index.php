<?php

/**
 * Start session
 * Makes sure sessions are secure and over http only and samesite
 */

    ini_set('session.cookie_secure', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

/**
 * Declare base directory and includes directory constants
 */

    define("BASE_DIR", __DIR__);
    define ("INCLUDES_DIR", BASE_DIR . '/includes' );


/**
 * Load environment variables from .env file.
 */

    require_once INCLUDES_DIR . '/Env.php';
    ENV::load(BASE_DIR . '/.env');

/**
 * Load Remaining variable constants declarations.
 */

    require_once INCLUDES_DIR . '/Constants.php';

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
 * File access authentication.  Used to protect against direct access to files for the app without being authenticated.  
 * Skipped if no specific file is requested other than the base url
 * IMPORTANT - The server must be configured for all url requests other than the base url to be redirected with a file url query of the requested path
 * Example.  Url https://www.partnerwithmagellan.com/assets/images/AdobeStock_354130260.webp will be directed as https://www.partnerwithmagellan.com/applications/apps/internal_use/sales_calculator?file=assets/images/AdobeStock_354130260.webp for the $_GET['file'] to be assets/images/AdobeStock_354130260.webp
 * The code runs on an apache server, and there is a .htaccess file that handles this url query directing.
 */

require_once INCLUDES_DIR . '/FileAccessAuth.php';

FileAccessAuth::authenticate(
    BASE_DIR, 
    SESSION_NAME, 
    FORBIDDEN_FILE_EXTENSIONS, 
    UNAUTHORIZED_REDIRECT_URL
);

/**
 * If SECURE constant variable is true, set session and load application.
 */ 

    $_SESSION[SESSION_NAME] = true;

    readfile(APP_FILE);
    exit;