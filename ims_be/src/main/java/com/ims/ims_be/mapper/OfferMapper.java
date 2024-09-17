package com.ims.ims_be.mapper;

import com.ims.ims_be.dto.offer.OfferCreateUpdateRequestDto;
import com.ims.ims_be.dto.offer.OfferListEntityResponseDto;
import com.ims.ims_be.dto.offer.OfferListResponseDto;
import com.ims.ims_be.dto.offer.OfferUpdateDetailResponseDto;
import com.ims.ims_be.entity.Offer;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
@Component
public interface OfferMapper {


    @Mapping(source = "id",target = "id")
    @Mapping(source = "candidate.fullName", target = "name")
    @Mapping(source = "candidate.email", target = "email")
    @Mapping(source = "approvedBy.fullName", target = "approver")
    @Mapping(source = "department", target = "department")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "status", target = "status")
    OfferListEntityResponseDto offerToOfferListEntityResponseDto(Offer offer);

    @Mapping(source = "id",target = "id")
    @Mapping(source = "candidate.fullName", target = "name")
    @Mapping(source = "candidate.email", target = "email")
    @Mapping(source = "approvedBy.fullName", target = "approver")
    @Mapping(source = "department", target = "department")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "status", target = "status")
    List<OfferListEntityResponseDto> offersToOfferListEntityResponseDtos(List<Offer> offers);

    @Mapping(target = "contractType", source = "contractType")
    @Mapping(target = "contractFrom", source = "contractFrom", qualifiedByName = "stringToDate")
    @Mapping(target = "contractTo", source = "contractTo", qualifiedByName = "stringToDate")
    @Mapping(target = "dueDate", source = "dueDate", qualifiedByName = "stringToDate")
    @Mapping(target = "position", source = "position")
    @Mapping(target = "level", source = "level")
    @Mapping(target = "note", source = "note")
    @Mapping(target = "department", source = "department")
    @Mapping(target = "salary", source = "salary")
    Offer offerCreateUpdateRequestDtoToOffer(OfferCreateUpdateRequestDto offerCreateUpdateRequestDto);

    @Mapping(target = "contractType", source = "contractType")
    @Mapping(target = "contractFrom", source = "contractFrom", qualifiedByName = "dateToString")
    @Mapping(target = "contractTo", source = "contractTo", qualifiedByName = "dateToString")
    @Mapping(target = "dueDate", source = "dueDate", qualifiedByName = "dateToString")
    @Mapping(target = "candidateId", source = "candidate", qualifiedByName = "candidateToCandidateId")
    @Mapping(target = "candidateName", source = "candidate", qualifiedByName = "candidateToCandidateName")
    @Mapping(target = "approvedById", source = "approvedBy", qualifiedByName = "approvedByToApprovedById")
    @Mapping(target = "recruiterId", source = "candidate", qualifiedByName = "recruiterToRecruiterIdOfCandidate")
    @Mapping(target = "position", source = "position")
    @Mapping(target = "level", source = "level")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "note", source = "note")
    @Mapping(target = "department", source = "department")
    @Mapping(target = "salary", source = "salary")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "timestampToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "timestampToString")
    @Mapping(target = "updatedBy", source = "updatedBy", qualifiedByName = "updatedByIdToUpdatedByUsername")
    @Mapping(target = "approvedByName", source = "approvedBy", qualifiedByName = "approvedByToApprovedByName")
    @Mapping(target = "recruiterName", source = "candidate", qualifiedByName = "recruiterToRecruiterNameOfCandidate")
    OfferUpdateDetailResponseDto offerToOfferUpdateDetailResponseDto(Offer offer);

    @Named("stringToDate")
    default Date stringToDate(String dateStr) {
        try {
            return new Date(new SimpleDateFormat("yyyy-MM-dd").parse(dateStr).getTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("dateToString")
    default String dateToString(Date date) {
        return new SimpleDateFormat("yyyy-MM-dd").format(date);
    }


    @Named("timestampToString")
    default String timestampToString(Timestamp timestamp) {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp);
    }

    @Named("updatedByIdToUpdatedByUsername")
    default String updatedByIdToUpdatedByUsername(User user) {
        try {
            return user.getAccount().getUsername();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("candidateToCandidateId")
    default String candidateToCandidateId(Candidate candidate) {
        try {
            return candidate.getId().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("candidateToCandidateName")
    default String candidateToCandidateName(Candidate candidate) {
        try {
            return candidate.getFullName();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("approvedByToApprovedById")
    default String approvedByToApprovedById(User approvedBy) {
        try {
            return approvedBy.getId().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("approvedByToApprovedByName")
    default String approvedByToApprovedByName(User approvedBy) {
        try {
            return approvedBy.getFullName();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("recruiterToRecruiterIdOfCandidate")
    default String recruiterToRecruiterIdOfCandidate(Candidate candidate) {
        try {
            return candidate.getRecruiter().getId().toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("recruiterToRecruiterNameOfCandidate")
    default String recruiterToRecruiterNameOfCandidate(Candidate candidate) {
        try {
            return candidate.getRecruiter().getFullName();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    default OfferListResponseDto offersToOfferListResponseDto(Page<Offer> offerPage) {
        List<OfferListEntityResponseDto> content = offerPage.getContent().stream()
                .map(this::offerToOfferListEntityResponseDto)
                .collect(Collectors.toList());
        return new OfferListResponseDto(content, offerPage.getTotalPages(), offerPage.getNumber(), offerPage.getSize());
    }


}
