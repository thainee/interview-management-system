package com.ims.ims_be.mapper;

import com.ims.ims_be.dto.job.JobDetailDto;
import com.ims.ims_be.dto.job.JobInListDto;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.job.*;
import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Level;
import com.ims.ims_be.enums.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface JobMapper {
    JobMapper INSTANCE = Mappers.getMapper(JobMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "title", target = "title")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "startDate", target = "startDate", dateFormat = "dd/MM/yyyy")
    @Mapping(source = "endDate", target = "endDate", dateFormat = "dd/MM/yyyy")
    @Mapping(source = "jobBenefits", target = "benefits", qualifiedByName = "jobBenefitsToEnums")
    @Mapping(source = "jobSkills", target = "skills", qualifiedByName = "jobSkillsToEnums")
    @Mapping(source = "jobLevels", target = "levels", qualifiedByName = "jobLevelsToEnums")
    JobInListDto jobToJobInListDto(Job job);

    @Mapping(target = "updatedBy", source = "user", qualifiedByName = "updatedByIdToUpdatedByUsername")
    @Mapping(source = "jobBenefits", target = "benefits", qualifiedByName = "jobBenefitsToEnums")
    @Mapping(source = "jobSkills", target = "skills", qualifiedByName = "jobSkillsToEnums")
    @Mapping(source = "jobLevels", target = "levels", qualifiedByName = "jobLevelsToEnums")
    JobDetailDto jobToJobDetailDto(Job job);

    @Mapping(target = "jobSkills", source = "skills", qualifiedByName = "enumsToJobSkills")
    @Mapping(target = "jobBenefits", source = "benefits", qualifiedByName = "enumsToJobBenefits")
    @Mapping(target = "jobLevels", source = "levels", qualifiedByName = "enumsToJobLevels")
    @Mapping(target = "startDate", source = "startDate", dateFormat = "dd/MM/yyyy")
    @Mapping(target = "endDate", source = "endDate", dateFormat = "dd/MM/yyyy")
    Job jobDetailDtoToJob(JobDetailDto dto);

    @Named("updatedByIdToUpdatedByUsername")
    default String updatedByIdToUpdatedByUsername(User user) {
        try {
            return user.getAccount().getUsername();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    @Named("updatedByToUpdatedByName")
    default String approvedByToApprovedByName(User updatedBy) {
        try {
            return updatedBy.getFullName();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Named("enumsToJobSkills")
    default List<JobSkill> enumsToJobSkills(List<Skill> skills) {
        if (skills == null) return null;
        return skills.stream()
                .map(skill -> {
                    JobSkill jobSkill = new JobSkill();
                    jobSkill.setId(new JobSkillId(null, skill));
                    return jobSkill;
                })
                .collect(Collectors.toList());
    }

    @Named("enumsToJobBenefits")
    default List<JobBenefit> enumsToJobBenefits(List<Benefit> benefits) {
        if (benefits == null) return null;
        return benefits.stream()
                .map(benefit -> {
                    JobBenefit jobBenefit = new JobBenefit();
                    jobBenefit.setId(new JobBenefitId(null, benefit));
                    return jobBenefit;
                })
                .collect(Collectors.toList());
    }

    @Named("enumsToJobLevels")
    default List<JobLevel> enumsToJobLevels(List<Level> levels) {
        if (levels == null) return null;
        return levels.stream()
                .map(level -> {
                    JobLevel jobLevel = new JobLevel();
                    jobLevel.setId(new JobLevelId(null, level));
                    return jobLevel;
                })
                .collect(Collectors.toList());
    }

    @Named("jobSkillsToEnums")
    default List<Skill> jobSkillsToEnums(List<JobSkill> jobSkills) {
        if (jobSkills == null) return null;
        return jobSkills.stream()
                .map(jobSkill -> jobSkill.getId().getSkill())
                .collect(Collectors.toList());
    }

    @Named("jobLevelsToEnums")
    default List<Level> jobLevelsToEnums(List<JobLevel> jobLevels) {
        if (jobLevels == null) return null;
        return jobLevels.stream()
                .map(jobLevel -> jobLevel.getId().getLevel())
                .collect(Collectors.toList());
    }

    @Named("jobBenefitsToEnums")
    default List<Benefit> jobBenefitsToEnums(List<JobBenefit> jobBenefits) {
        if (jobBenefits == null) return null;
        return jobBenefits.stream()
                .map(jobBenefit -> jobBenefit.getId().getBenefit())
                .collect(Collectors.toList());
    }


}