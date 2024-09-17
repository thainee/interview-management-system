package com.ims.ims_be.dto.schedule;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
public class ScheduleDetailDto {
    private Integer id;
    private String title;
    private String jobTitle;
    private String candidateName;
    private List<InterviewerDto> interviewers;
    private String recruiterName;
    // scheduleTime
    private Date interviewDate;
    private Timestamp startTime;
    private Timestamp endTime;
    // private String scheduleTime;
    private String result;
    private String location;
    private String note;
    private String meetingLink;
    private String status;
}
