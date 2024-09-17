package com.ims.ims_be.controller;

import com.ims.ims_be.dto.candidate.CandidateDetailDto;
import com.ims.ims_be.dto.error.ErrorResponse;
import com.ims.ims_be.dto.schedule.InterviewerDto;
import com.ims.ims_be.dto.schedule.ReminderRequest;
import com.ims.ims_be.dto.schedule.ScheduleDetailDto;
import com.ims.ims_be.dto.schedule.ScheduleInListDto;
import com.ims.ims_be.service.candidate.CandidateService;
import com.ims.ims_be.service.schedule.ScheduleService;
import com.ims.ims_be.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Schedule Management", description = "Operations pertaining to schedule management")
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final CandidateService candidateService;

    @Operation(summary = "Retrieve list of interviewers", description = "Get a list of all available interviewers")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of interviewers",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = InterviewerDto.class)))
    @GetMapping(value = "/interviewers", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<InterviewerDto> searchInterviewers() {
        return scheduleService.searchInterviewers();
    }

    @GetMapping(value = "/candidates", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CandidateDetailDto> searchCandidates(){return candidateService.getListCandidateForSchedule();}


    @Operation(summary = "Retrieve paginated list of schedules", description = "Get a page of schedules with optional filtering")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of schedules",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class)))
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<ScheduleInListDto> searchSchedule(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search term")
            @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Interviewer ID")
            @RequestParam(required = false) Integer interviewer,
            @Parameter(description = "Schedule status")
            @RequestParam(required = false) String status) {
        return scheduleService.getSchedules(searchTerm, interviewer, status, page, size);
    }

    @Operation(summary = "Retrieve a schedule by ID", description = "Get detailed information of a schedule by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved schedule details",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ScheduleDetailDto.class)))
    @ApiResponse(responseCode = "404", description = "Schedule not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ScheduleDetailDto getScheduleById(
            @Parameter(description = "ID of the schedule", required = true)
            @PathVariable Integer id) {
        return scheduleService.getScheduleById(id);
    }

    @Operation(summary = "Create a new schedule", description = "Add a new schedule with the provided information")
    @ApiResponse(responseCode = "200", description = "Schedule successfully created",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ScheduleDetailDto.class)))
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ScheduleDetailDto> createSchedule(
            @Parameter(description = "Schedule information", required = true)
            @RequestBody ScheduleDetailDto scheduleDTO) {

        ScheduleDetailDto createdSchedule = scheduleService.createSchedule(scheduleDTO);
        return ResponseEntity.ok(createdSchedule);
    }

    @Operation(summary = "Update an existing schedule", description = "Modify an existing schedule's information")
    @ApiResponse(responseCode = "200", description = "Schedule successfully updated",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ScheduleDetailDto.class)))
    @ApiResponse(responseCode = "404", description = "Schedule not found",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping(value = "/{id}/edit", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ScheduleDetailDto> updateSchedule(
            @Parameter(description = "ID of the schedule to update", required = true)
            @PathVariable Integer id,
            @Parameter(description = "Updated schedule information", required = true)
            @RequestBody ScheduleDetailDto scheduleDetailDto) {
        ScheduleDetailDto updateSchedule = scheduleService.updateSchedule(id, scheduleDetailDto);
        return ResponseEntity.ok(updateSchedule);
    }

    @PutMapping(value = "/{id}/submit", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ScheduleDetailDto> submitSchedule(
            @Parameter(description = "ID of the schedule to update", required = true)
            @PathVariable Integer id,
            @Parameter(description = "Updated schedule information", required = true)
            @RequestBody ScheduleDetailDto scheduleDetailDto) {
        ScheduleDetailDto updateSchedule = scheduleService.updateSchedule(id, scheduleDetailDto);
        return ResponseEntity.ok(updateSchedule);
    }

    @Operation(summary = "Send reminder for a schedule", description = "Send a reminder email for a specific schedule")
    @ApiResponse(responseCode = "200", description = "Reminder sent successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping(value = "/send-reminder", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> sendReminder(
            @Parameter(description = "Reminder request information", required = true)
            @RequestBody ReminderRequest request) {
        return scheduleService.sendReminderEmail(request);
    }
//    @Operation(summary = "Send reminder for a schedule", description = "Send a reminder email for a specific schedule")
//    @ApiResponse(responseCode = "200", description = "Reminder sent successfully")
//    @ApiResponse(responseCode = "400", description = "Invalid input data",
//            content = @Content(mediaType = "application/json",
//                    schema = @Schema(implementation = ErrorResponse.class)))
//    @PostMapping(value = "/send-reminder", produces = MediaType.APPLICATION_JSON_VALUE)
//    public void sendReminder(
//            @Parameter(description = "Reminder request information", required = true)
//            @RequestBody ReminderRequest request) {
//         scheduleService.sendReminderEmail(request);
//    }

}