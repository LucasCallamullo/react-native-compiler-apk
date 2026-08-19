package com.vg.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

/**
 * Global exception handler that acts as centralized error-handling middleware.
 * Intercepts exceptions thrown from any controller or service and transforms
 * them into a consistent ErrorResponse format.
 * 
 * @see AppException
 * @see ErrorResponse
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ============================================
    // VALIDATION ERRORS
    // ============================================
    
    /**
     * Handles validation errors from @Valid annotated DTOs.
     * Triggered when request body fails validation constraints.
     * 
     * Example: POST /api/users with invalid email format
     * 
     * @param ex the MethodArgumentNotValidException containing validation errors
     * @param request the HTTP request
     * @return ErrorResponse with 400 status and detailed validation messages
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, 
            HttpServletRequest request) {
        
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        
        log.warn("Validation error at {}: {}", request.getRequestURI(), errorMessage);
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), 
            errorMessage, 
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles validation errors for path variables and query parameters.
     * 
     * Example: GET /api/users/{id} with @Min(1) and id = 0
     * 
     * @param ex the ConstraintViolationException
     * @param request the HTTP request
     * @return ErrorResponse with 400 status
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {
        
        String errorMessage = ex.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .collect(Collectors.joining(", "));
        
        log.warn("Constraint violation at {}: {}", request.getRequestURI(), errorMessage);
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), 
            errorMessage, 
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles type mismatch errors (e.g., String passed to Long parameter).
     * 
     * Example: GET /api/users/abc (where id should be a number)
     * 
     * @param ex the MethodArgumentTypeMismatchException
     * @param request the HTTP request
     * @return ErrorResponse with 400 status
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {
        
        String errorMessage = String.format("Invalid parameter '%s' with value '%s'. Expected type: %s",
                ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());
        
        log.warn("Type mismatch at {}: {}", request.getRequestURI(), errorMessage);
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), 
            errorMessage, 
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // ============================================
    // CUSTOM APP EXCEPTION
    // ============================================
    
    /**
     * Handles custom AppException thrown from services.
     * Returns the HTTP status code specified in the exception.
     * 
     * Usage in service:
     * throw new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND);
     * throw new AppException("Invalid email format", HttpStatus.BAD_REQUEST);
     * throw new AppException("Email already exists", HttpStatus.CONFLICT);
     * 
     * @param ex the AppException instance
     * @param request the HTTP request
     * @return standardized ErrorResponse with the specified status code
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(
            AppException ex, 
            HttpServletRequest request) {

        log.warn("AppException at {}: {} (status {})", 
            request.getRequestURI(), ex.getMessage(), ex.getStatus());
        
        ErrorResponse error = new ErrorResponse(
            ex.getStatus(),
            ex.getMessage(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.valueOf(ex.getStatus()));
    }
    
    // ============================================
    // DATA ACCESS EXCEPTIONS
    // ============================================
    
    /**
     * Handles runtime exceptions (e.g., from repositories).
     * Defaults to 404 (Not Found) status code.
     * 
     * Useful when orElseThrow() is used without a custom exception:
     * repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
     * 
     * @param ex the RuntimeException instance
     * @param request the HTTP request
     * @return ErrorResponse with 404 status
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(
            RuntimeException ex,
            HttpServletRequest request) {

        log.warn("RuntimeException at {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    // ============================================
    // FALLBACK HANDLER
    // ============================================
    
    /**
     * Fallback handler for any unhandled exception.
     * Returns 500 (Internal Server Error) to the client.
     * 
     * Acts as a safety net for any exception not caught by other handlers.
     * 
     * @param ex the Exception instance
     * @param request the HTTP request
     * @return ErrorResponse with 500 status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        log.error("Unhandled exception at {}: ", request.getRequestURI(), ex);

        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal server error: " + ex.getMessage(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}