package com.travelPlanner.planner.exception;

import com.travelPlanner.planner.dto.exception.CustomExceptionDto;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(OverviewNoteNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleTripNoteNotFoundException(OverviewNoteNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(TripInviteNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleTripInviteNotFoundException(TripInviteNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(TripDayNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleTripDayNotFoundException(TripDayNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(CollaboratorAlreadyExistsException.class)
    public ResponseEntity<CustomExceptionDto> handleCollaboratorAlreadyExistsException(CollaboratorAlreadyExistsException ex) {
        return ResponseEntity.status(CONFLICT).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        CONFLICT.value()
                )
        );
    }

    @ExceptionHandler(ActivityNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleActivityNotFoundException(ActivityNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CustomExceptionDto> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(FORBIDDEN).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        FORBIDDEN.value()
                )
        );
    }

    @ExceptionHandler(FolderNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleFolderNotFoundException(FolderNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(InvalidDateException.class)
    public ResponseEntity<CustomExceptionDto> handleInvalidDateException(InvalidDateException ex) {
        return ResponseEntity.status(BAD_REQUEST).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        BAD_REQUEST.value()
                )
        );
    }

    @ExceptionHandler(DayNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleDayNotFoundException(DayNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleTripNotFoundException(TripNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<CustomExceptionDto> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        NOT_FOUND.value()
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomExceptionDto> handleException(Exception ex) {
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(
                new CustomExceptionDto(
                        ex.getMessage(),
                        LocalDateTime.now(),
                        INTERNAL_SERVER_ERROR.value()
                )
        );
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        // Extract global errors.
        List<String> globalErrors = ex.getBindingResult()
                .getGlobalErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        // Extract field errors.
        List<String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        // Combine them.
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(globalErrors);
        allErrors.addAll(fieldErrors);

        // Return it.
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(Map.of("message", String.join(", ", allErrors)));
    }
}
