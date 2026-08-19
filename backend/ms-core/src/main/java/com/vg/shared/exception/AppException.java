package com.vg.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Custom runtime exception for application-specific errors.
 * Allows setting both a message and an HTTP status code.
 * 
 * Usage examples:
 * 
 * // User not found (404)
 * throw new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND);
 * 
 * // Invalid input (400)
 * throw new AppException("Email format is invalid", HttpStatus.BAD_REQUEST);
 * 
 * // Conflict (409)
 * throw new AppException("User already exists with email: " + email, HttpStatus.CONFLICT);
 * 
 * // Default status 400
 * throw new AppException("Invalid request data");
 * 
 * @see GlobalExceptionHandler
 */
@Getter
public class AppException extends RuntimeException {
    
    /**
     * HTTP status code to be returned to the client.
     */
    private final int status;
    
    /**
     * Constructs a new AppException with the specified message and HTTP status.
     *
     * @param message the detail message (returned to client)
     * @param status the HTTP status (e.g., HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST)
     */
    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status.value();
    }
    
    /**
     * Constructs a new AppException with the specified message and status code.
     *
     * @param message the detail message (returned to client)
     * @param status the HTTP status code as integer (e.g., 400, 404, 409)
     */
    public AppException(String message, int status) {
        super(message);
        this.status = status;
    }
    
    /**
     * Constructs a new AppException with the specified message.
     * Default status code is 400 (Bad Request).
     *
     * @param message the detail message (returned to client)
     */
    public AppException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }
}