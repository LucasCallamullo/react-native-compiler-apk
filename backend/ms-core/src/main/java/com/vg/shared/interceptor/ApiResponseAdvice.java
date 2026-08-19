package com.vg.shared.interceptor;

import com.vg.shared.exception.ErrorResponse;
// import com.vg.shared.interceptor.ApiResponse;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * Intercepts all successful responses and wraps them in a consistent ApiResponse format.
 * Works like middleware that transforms responses before sending to client.
 */
@ControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    /**
     * Decides if this advice should be applied.
     * Returns true for all responses except ErrorResponse (which is already wrapped).
     */
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Don't wrap ErrorResponse (they are already formatted by GlobalExceptionHandler)
        return !returnType.getParameterType().equals(ErrorResponse.class);
    }

    /**
     * Wraps the response body in a standardized ApiResponse.
     * This transforms: { "id": 1, "name": "Juan" } 
     * Into: { "timestamp": "...", "status": 200, "message": "Success", "data": { "id": 1, "name": "Juan" }, "success": true }
     */
    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {
        
        // If response is already an ApiResponse, return it as is
        if (body instanceof ApiResponse) {
            return body;
        }
        
        // If body is null, return empty success response
        if (body == null) {
            return new ApiResponse<>(200, "Success", null);
        }
        
        // Wrap the response in ApiResponse
        return new ApiResponse<>(200, "Success", body);
    }
}