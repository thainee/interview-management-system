package com.ims.ims_be.utils;

public class AppConstants {
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final String ORDER_BY_CANDIDATE_STATUS_AND_CREATED_AT = "ORDER BY " +
            "CASE c.status " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.WAITING_FOR_INTERVIEW THEN 1 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.WAITING_FOR_APPROVAL THEN 2 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.WAITING_FOR_RESPONSE THEN 3 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.OPEN THEN 4 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.PASSED_INTERVIEW THEN 5 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.APPROVED_OFFER THEN 6 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.REJECTED_OFFER THEN 7 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.ACCEPTED_OFFER THEN 8 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.DECLINED_OFFER THEN 9 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.CANCELLED_OFFER THEN 10 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.FAILED_INTERVIEW THEN 11 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.CANCELLED_INTERVIEW THEN 12 " +
            "WHEN com.ims.ims_be.enums.CandidateStatus.BANNED THEN 13 " +
            "ELSE 14 END, " +
            "c.createdAt DESC";

    public static final String PHONE_REGEX = "^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,3})|(\\(?\\d{2,3}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$";
}
