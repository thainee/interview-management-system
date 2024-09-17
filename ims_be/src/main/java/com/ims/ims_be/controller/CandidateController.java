package com.ims.ims_be.controller;

import com.ims.ims_be.dto.error.ErrorResponse;
import com.ims.ims_be.dto.candidate.CandidateDetailDto;
import com.ims.ims_be.dto.candidate.CandidateListResponse;
import com.ims.ims_be.dto.candidate.CandidateRequestDto;
import com.ims.ims_be.dto.error.ValidationErrorResponse;
import com.ims.ims_be.service.candidate.CandidateService;
import com.ims.ims_be.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Candidate Management", description = "Operations pertaining to candidate management")
public class CandidateController {

    private final CandidateService candidateService;

    @Operation(
            summary = "Retrieve paginated list of candidates",
            description = "Get a page of candidates with optional filtering by status and search term. The response is paginated.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of candidates",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateListResponse.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input parameters",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CandidateListResponse getCandidates(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @Parameter(description = "Search term for candidate name")
            @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Candidate status filter", example = "WAITING_FOR_INTERVIEW")
            @RequestParam(required = false) String status) {
        return candidateService.getCandidates(searchTerm, status, pageNumber);
    }

    @Operation(summary = "Retrieve a candidate by ID", description = "Get detailed information of a candidate by their ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved candidate details",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateDetailDto.class)))
    @ApiResponse(responseCode = "404", description = "Candidate not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CandidateDetailDto getCandidateById(
            @Parameter(description = "ID of the candidate", required = true)
            @PathVariable Integer id) {
        return candidateService.getCandidateById(id);
    }

    @Operation(summary = "Retrieve a candidate for editing", description = "Get candidate information for editing purposes")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved candidate for editing",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateRequestDto.class)))
    @ApiResponse(responseCode = "404", description = "Candidate not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping(value = "/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CandidateRequestDto getEditCandidateById(
            @Parameter(description = "ID of the candidate to edit", required = true)
            @PathVariable Integer id) {
        return candidateService.getEditCandidateById(id);
    }

    @Operation(summary = "Create a new candidate", description = "Add a new candidate with the provided information and CV file")
    @ApiResponse(responseCode = "201", description = "Candidate successfully created",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateDetailDto.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input data",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ValidationErrorResponse.class)))
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CandidateDetailDto addCandidate(
            @Parameter(description = "Candidate information", required = true)
            @Valid @RequestPart("candidateRequestDto") CandidateRequestDto candidateRequestDto,
            @Parameter(description = "CV file", required = true)
            @RequestPart("cv") MultipartFile file) throws IOException, GeneralSecurityException {
        return candidateService.createCandidate(candidateRequestDto, file);
    }

    @Operation(summary = "Update an existing candidate", description = "Modify an existing candidate's information and CV file")
    @ApiResponse(responseCode = "200", description = "Candidate successfully updated",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateDetailDto.class)))
    @ApiResponse(responseCode = "400", description = "Invalid input data",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ValidationErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Candidate not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CandidateDetailDto updateCandidate(
            @Parameter(description = "ID of the candidate to update", required = true)
            @PathVariable Integer id,
            @Parameter(description = "Updated candidate information", required = true)
            @Valid @RequestPart("candidateRequestDto") CandidateRequestDto candidateRequestDto,
            @Parameter(description = "Updated CV file", required = true)
            @RequestPart("cv") MultipartFile file) throws IOException, GeneralSecurityException {
        return candidateService.updateCandidate(id, candidateRequestDto, file);
    }

    @Operation(summary = "Delete a candidate", description = "Remove a candidate by their ID")
    @ApiResponse(responseCode = "204", description = "Candidate successfully deleted")
    @ApiResponse(responseCode = "404", description = "Candidate not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCandidateById(
            @Parameter(description = "ID of the candidate to delete", required = true)
            @PathVariable Integer id) {
        candidateService.deleteCandidate(id);
    }

    @Operation(summary = "Ban a candidate", description = "Change the status of a candidate to BANNED")
    @ApiResponse(responseCode = "200", description = "Candidate successfully banned",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = CandidateDetailDto.class)))
    @ApiResponse(responseCode = "404", description = "Candidate not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping(value = "/{id}/ban", produces = MediaType.APPLICATION_JSON_VALUE)
    public CandidateDetailDto banCandidateById(
            @Parameter(description = "ID of the candidate to ban", required = true)
            @PathVariable Integer id) {
        return candidateService.banCandidate(id);
    }
}