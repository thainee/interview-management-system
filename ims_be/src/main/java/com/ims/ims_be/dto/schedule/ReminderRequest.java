package com.ims.ims_be.dto.schedule;

import lombok.Data;


import java.util.List;

@Data

public class ReminderRequest {
    private List<String> emails;
    private Integer id;
}
