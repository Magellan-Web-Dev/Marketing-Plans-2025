<?php

declare(strict_types=1);

class Env {

    /**
     * Takes variables from the .env file and adds their keys and values to the $_ENV superglobal
     * @return void
     */

    public static function load(string $file_path): void {

        // Check If .env Exists

        if (!file_exists($file_path)) {
            echo "Unable to load .env file";
            die();
        }

        // Read .env File. Throw Error If Problem Reading It

        $lines = file($file_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            echo "Unable to load .env file";
            die();
        }

        // Loop Through Lines And Assign Environment Variables And Values

        foreach ($lines as $line) {

            // Skip lines that are comments or empty

            $trimmedLine = trim($line);
            if ($trimmedLine === '' || str_starts_with($trimmedLine, '#')) {
                continue;
            }

            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Convert comma-separated values into an array

                if (strpos($value, ',') !== false) {
                    $value = array_map('trim', explode(',', $value));
                }

                // Set the environment variable in the $_ENV array

                $_ENV[$key] = $value;
            }
        }
    }
}
