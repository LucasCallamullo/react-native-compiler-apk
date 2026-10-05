package com.vg.shared.interceptor;

import com.vg.shared.exception.ErrorResponse;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * Intercepts all successful responses and wraps them in a consistent ApiResponse format.
 * Works like middleware that transforms responses before sending to client.
 *
 * Skips binary responses (files, streams, byte arrays) so they are sent raw.
 */
@ControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // No aplicar el advice si el método del controller devuelve binarios/streams.
        // Así beforeBodyWrite ni siquiera se ejecuta para estos endpoints.
        Class<?> type = returnType.getParameterType();

        if (Resource.class.isAssignableFrom(type)
                || InputStreamResource.class.isAssignableFrom(type)
                || StreamingResponseBody.class.isAssignableFrom(type)
                || byte[].class.equals(type)) {
            return false;
        }

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

        // Cinturón y tirantes: si el body ya es binario/stream, no tocar.
        if (body instanceof Resource
                || body instanceof InputStreamResource
                || body instanceof StreamingResponseBody
                || body instanceof byte[]) {
            return body;
        }

        // Solo envolver respuestas JSON. Cualquier otro content-type (image/png,
        // application/octet-stream, application/pdf, etc.) pasa sin tocar.
        if (selectedContentType == null
                || !MediaType.APPLICATION_JSON.isCompatibleWith(selectedContentType)) {
            return body;
        }

        // Si ya es un ApiResponse, no re-envolver
        if (body instanceof ApiResponse) {
            return body;
        }

        // Si el body es ErrorResponse, no envolver (GlobalExceptionHandler ya lo formateó)
        if (body instanceof ErrorResponse) {
            return body;
        }

        // Si body es null, devolver success vacío
        if (body == null) {
            return new ApiResponse<>(200, "Success", null);
        }

        // Envolver JSON normal
        return new ApiResponse<>(200, "Success", body);
    }
}