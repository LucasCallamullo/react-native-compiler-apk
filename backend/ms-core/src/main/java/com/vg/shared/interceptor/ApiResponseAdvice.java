package com.vg.shared.interceptor;

import com.vg.shared.exception.ErrorResponse;
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

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Always return true, we'll handle the exclusion in beforeBodyWrite
        return true;
    }

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
        
        // If body is ErrorResponse, don't wrap it (GlobalExceptionHandler already formatted it)
        if (body instanceof ErrorResponse) {
            return body;
        }
        
        // Wrap the response in ApiResponse
        return new ApiResponse<>(200, "Success", body);
    }
}