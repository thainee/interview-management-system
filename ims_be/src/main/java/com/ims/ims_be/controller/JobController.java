package com.ims.ims_be.controller;


import com.ims.ims_be.dto.job.JobDetailDto;
import com.ims.ims_be.dto.job.JobInListDto;
import com.ims.ims_be.dto.job.JobRequestDto;
import com.ims.ims_be.entity.job.Job;
import com.ims.ims_be.mapper.JobMapper;
import com.ims.ims_be.service.job.JobService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;

@RestController
@RequestMapping("/api/jobs")
@AllArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper;

    @GetMapping()
    public Page<JobInListDto> searchCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String status
    ) {
        // Đảm bảo page và size là các giá trị hợp lệ
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10; // Giá trị mặc định
        }
        return jobService.searchJobs(searchTerm, status, page, size);
    }
    @DeleteMapping("/{id}")
    public void deleteJobById(@PathVariable int id) {
        jobService.deleteJob(id);
    }
    @PostMapping
    public ResponseEntity<?> addJob(@RequestBody JobDetailDto jobDetailDto) {
        try {
            Job job = jobMapper.jobDetailDtoToJob(jobDetailDto);
            JobDetailDto createdJob = jobService.createJob(job);
            return ResponseEntity.ok(createdJob);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating job: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public JobDetailDto getJobById(@PathVariable Integer id) {
        return jobService.getJobById(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<JobDetailDto> editJob(@PathVariable Integer id,
                                                @RequestBody JobRequestDto updatedJob) {
        JobDetailDto editedJob = jobService.editJob(id, updatedJob);
        return ResponseEntity.ok(editedJob);

    }
}
@RestControllerAdvice
class GlobalControllerAdvicex {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Integer.class, "page", new IntegerEditor(0));
        binder.registerCustomEditor(Integer.class, "size", new IntegerEditor(10));
    }

    static class IntegerEditor extends PropertyEditorSupport {
        private final int defaultValue;

        public IntegerEditor(int defaultValue) {
            this.defaultValue = defaultValue;
        }

        @Override
        public void setAsText(String text) {
            try {
                setValue(Integer.parseInt(text));
            } catch (NumberFormatException e) {
                setValue(defaultValue);
            }
        }
    }
}
