package com.vg.shared.exception;

import java.time.LocalDateTime;

/**
 * Standard error response format returned to the client when an exception occurs.
 * Provides consistent error structure across all API endpoints.
 * 

 * 
 * @param timestamp the exact time when the error occurred
 * @param status the HTTP status code (e.g., 400, 404, 500)
 * @param error the error message describing what went wrong
 * @param path the request URI that caused the error
 */
public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String message,
    String path,
    boolean success
) {
    
    /**
     * Creates an ErrorResponse with the current timestamp.
     *
     * @param status the HTTP status code
     * @param message the error message
     * @param path the request URI
     */
    public ErrorResponse(int status, String message, String path) {
        this(LocalDateTime.now(), status, message, path, false);
    }
}