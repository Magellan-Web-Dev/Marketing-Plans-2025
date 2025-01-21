<?php

declare(strict_types=1);

class FileAccessAuth {

    /**
     * The server must be configured to have files request urls redirected to a ?file url query with the url after the base path
     */

    private static array $mimeTypes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'html' => 'text/html',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'otf' => 'font/otf',
    ];

    /**
     * Authenticate user for files access.
     * Checks if there is a ?file url query in the request.
     * Then checks for a session.
     * If a forbidden file extension is accessed, then a redirect is made to the unauthorized_redirect_url.
     * @param $base_url - string - Establishes the base url for the ?file url query.
     * @param $session_name - string - Session name for file access authentication.
     * @param $forbidden_extensions - array - List of file extensions that nobody is allowed to directly access regardless if authenticated or not.
     * @param $unauthorized_redirect_url - string - Url to redirect if authentication fails or a forbidden file extension is requested.
     * @return void
     */

    public static function authenticate(string $base_url = '', string $session_name = '', array $forbidden_extensions = [], string $unauthorized_redirect_url = ''): void {

        // Sanitize the file request
        $file_requested = preg_replace('/[^a-zA-Z0-9_\-\/\.]/', '', $_GET['file'] ?? '');

        // If no file requested or required parameters missing values, then return
        if (!$file_requested || !$base_url || !$session_name || !$unauthorized_redirect_url) {
            return;
        }

        // If any forbidden file extension types are requested, return a 403 forbidden response
        if (self::forbiddenFile($file_requested, $forbidden_extensions)) {
            http_response_code(403);
            header('Location: ' . $unauthorized_redirect_url);
            exit;
        }

        // Make sure user has been authenticated through a session
        if (!isset($_SESSION[$session_name])) {
            http_response_code(401);
            header('Location: ' . $unauthorized_redirect_url);
            exit;
        }

        // Resolve the file path securely
        $file_path = realpath($base_url . '/' . $file_requested);

        // Validate file path to ensure it's within the allowed directory
        if ($file_path && strpos($file_path, $base_url . DIRECTORY_SEPARATOR) === 0 && file_exists($file_path)) {

            // Get file extension
            $file_extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));

            // Determine content type
            $content_type = self::$mimeTypes[$file_extension] ?? mime_content_type($file_path) ?: 'application/octet-stream';

            // Serve the file
            header('Content-Type: ' . $content_type);
            header('Content-Length: ' . filesize($file_path));
            readfile($file_path);
            exit;
        } else {
            // File not found or invalid path
            header("HTTP/1.1 404 Not Found");
            exit;
        }
    }

    /**
     * Checks if a file extension being requested is listed in an array of forbidden extensions.
     * @param $file_requested - string - File name with extension.
     * @param $forbidden_extensions - array - List of forbidden file extensions.
     * @return bool - Returns true if file extension is listed in forbidden extensions, otherwise returns false.
     */

    private static function forbiddenFile(string $file_requested, array $forbidden_extensions): bool {
        $file_extension = strtolower(pathinfo($file_requested, PATHINFO_EXTENSION));
        return in_array($file_extension, $forbidden_extensions, true);
    }
}
