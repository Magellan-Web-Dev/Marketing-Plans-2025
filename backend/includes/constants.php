<?php

/** Constants variables declarations.
 *  Environment variables must be loaded first and BASE_DIR must be declared.
 */

    define("PROTOCOL", isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');
    define("SITE_URL", PROTOCOL . "://" . filter_var($_SERVER['HTTP_HOST'], FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME));
    define("ENVIRONMENT", $_ENV['VITE_ENVIRONMENT'] ?? 'production');
    define("SECURE", ENVIRONMENT === 'development' || PROTOCOL === "https");
    define("APP_FILE", BASE_DIR . '/' . $_ENV['APP_FILE']);
    define("SESSION_NAME", $_ENV['SESSION_NAME'] ?? 'authenticated');
    define("FORBIDDEN_FILE_EXTENSIONS", $_ENV['FORBIDDEN_FILE_EXTENSIONS'] ?? []);
    define("UNAUTHORIZED_REDIRECT_URL", $_ENV['UNAUTHORIZED_REDIRECT_URL'] ?? 'https://www.partnerwithmagellan.com/unauthorized/');
    define("PRODUCTION_BASE_URL", $_ENV['VITE_PRODUCTION_BASE_URL'] ?? '/');
    define("CURRENT_BASE_URL", ENVIRONMENT === 'development' ? '/' : PRODUCTION_BASE_URL);
