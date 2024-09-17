package com.ims.ims_be.dto.schedule;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleInListDto {
    private Integer id;
    private String title;
    private String candidateName;
    private List<InterviewerDto> interviewers;
    //scheduleTime
    private Date interviewDate;
    private Timestamp startTime;
    private Timestamp endTime;
    // private String scheduleTime;
    private String result;
    private String status;
    private String jobTitle;
}
