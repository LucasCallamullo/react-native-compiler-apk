package com.vg.shared.interceptor;

import java.time.LocalDateTime;

/**
 * Standard API response format for successful responses.
 * Wraps the actual data with metadata.
 * 
 * @param timestamp when the response was generated
 * @param status HTTP status code
 * @param message human-readable message
 * @param data the actual response data
 * @param success always true for successful responses
 */
public record ApiResponse<T>(
    LocalDateTime timestamp,
    int status,
    String message,
    T data,
    boolean success
) {
    
    /**
     * Creates a success response with the current timestamp.
     * 
     * @param message success message
     * @param data the actual data
     */
    public ApiResponse(String message, T data) {
        this(LocalDateTime.now(), 200, message, data, true);
    }
    
    /**
     * Creates a success response with default message.
     * 
     * @param data the actual data
     */
    public ApiResponse(T data) {
        this("Success", data);
    }
    
    /**
     * Creates a success response with custom status code.
     * 
     * @param status HTTP status code
     * @param message success message
     * @param data the actual data
     */
    public ApiResponse(int status, String message, T data) {
        this(LocalDateTime.now(), status, message, data, true);
    }
}
