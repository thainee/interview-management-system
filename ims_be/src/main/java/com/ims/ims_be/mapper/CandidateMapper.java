package com.ims.ims_be.mapper;

import com.ims.ims_be.dto.candidate.CandidateCreateOfferResponseDto;
import com.ims.ims_be.dto.candidate.CandidateDetailDto;
import com.ims.ims_be.dto.candidate.CandidateDto;
import com.ims.ims_be.dto.candidate.CandidateInListDto;
import com.ims.ims_be.dto.candidate.CandidateListResponse;
import com.ims.ims_be.dto.candidate.CandidateRequestDto;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.entity.candidate.CandidateSkill;
import com.ims.ims_be.enums.Skill;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CandidateMapper {
    @Mapping(source = "recruiter.account.username", target = "ownerHR")
    CandidateInListDto candidateToCandidateInListDto(Candidate candidate);

    @Mapping(source = "recruiterId", target = "recruiter", qualifiedByName = "toUserReference")
    Candidate candidateRequestDtoToCandidate(CandidateRequestDto candidateRequestDto);

    default List<Skill> listStringstoListSkills(List<String> skills) {
        return skills.stream().map(Skill::valueOf).collect(Collectors.toList());
    }

    @Named("enumToString")
    default String enumToString(Enum<?> enumValue) {
        return enumValue != null ? enumValue.name() : null;
    }

    @Named("candidateSkillsToSkillNames")
    default List<String> candidateSkillsToSkillNames(List<CandidateSkill> candidateSkills) {
        if (candidateSkills == null) {
            return null;
        }
        return candidateSkills.stream()
                .map(CandidateSkill::getSkill)
                .map(Skill::name)
                .collect(Collectors.toList());
    }

    @Mapping(target = "recruiterDisplayName", expression = "java(getRecruiterDisplayName(candidate.getRecruiter()))")
    @Mapping(source = "cv", target = "cvCandidate")
    @Mapping(source = "position", target = "position", qualifiedByName = "enumToString")
    @Mapping(source = "highestLevel", target = "highestLevel", qualifiedByName = "enumToString")
    @Mapping(source = "candidateSkills", target = "skills", qualifiedByName = "candidateSkillsToSkillNames")
    CandidateDetailDto candidateToDetailDto(Candidate candidate);

    @Mapping(source = "recruiter.id", target = "recruiterId")
    @Mapping(source = "position", target = "position", qualifiedByName = "enumToString")
    @Mapping(source = "highestLevel", target = "highestLevel", qualifiedByName = "enumToString")
    @Mapping(source = "candidateSkills", target = "skills", qualifiedByName = "candidateSkillsToSkillNames")
    CandidateRequestDto candidateToRequestDto(Candidate candidate);

    default String getRecruiterDisplayName(User recruiter) {
        if (recruiter == null || recruiter.getAccount() == null) {
            return null;
        }
        return recruiter.getFullName() + " (" + recruiter.getAccount().getUsername() + ")";
    }

    default String getUpdatedBy(User recruiter) {
        if (recruiter == null || recruiter.getAccount() == null) {
            return null;
        }
        return recruiter.getAccount().getUsername();
    }

    @Named("toUserReference")
    default User toUserReference(Integer id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }

    default CandidateListResponse candidatesToCandidateListResponse(Page<Candidate> candidatePage) {
        List<CandidateInListDto> content = candidatePage.getContent().stream()
                .map(this::candidateToCandidateInListDto)
                .collect(Collectors.toList());
        return new CandidateListResponse(content, candidatePage.getTotalPages(), candidatePage.getNumber(), candidatePage.getSize());
    }

    CandidateDto candidateToCandidateDto(Candidate candidate);

    default List<CandidateDto> candidatesToCandidateDtos(List<Candidate> candidates) {
        return candidates.stream()
                .map(this::candidateToCandidateDto)
                .collect(Collectors.toList());
    }

    @Mapping(source = "id", target = "candidateId")
    @Mapping(source = "fullName", target = "candidateName")
    CandidateCreateOfferResponseDto candidateToCandidateCreateOfferResponseDto(Candidate candidate);

    @IterableMapping(elementTargetType = CandidateCreateOfferResponseDto.class)
    List<CandidateCreateOfferResponseDto> candidatesToCandidateCreateOfferResponseDtos(List<Candidate> candidates);

}


