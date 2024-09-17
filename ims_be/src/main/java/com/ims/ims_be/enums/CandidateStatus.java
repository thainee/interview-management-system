package com.ims.ims_be.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum CandidateStatus {
    WAITING_FOR_INTERVIEW(1),
    WAITING_FOR_APPROVAL(2),
    WAITING_FOR_RESPONSE(3),
    OPEN(4),
    PASSED_INTERVIEW(5),
    APPROVED_OFFER(6),
    REJECTED_OFFER(7),
    ACCEPTED_OFFER(8),
    DECLINED_OFFER(9),
    CANCELLED_OFFER(10),
    FAILED_INTERVIEW(11),
    CANCELLED_INTERVIEW(12),
    BANNED(13);

    private final int order;
}