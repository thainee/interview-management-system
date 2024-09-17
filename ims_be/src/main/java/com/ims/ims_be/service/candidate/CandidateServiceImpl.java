package com.ims.ims_be.service.candidate;

import com.ims.ims_be.dto.candidate.*;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.entity.candidate.CandidateSkill;
import com.ims.ims_be.entity.candidate.CandidateSkillId;
import com.ims.ims_be.enums.CandidateStatus;
import com.ims.ims_be.enums.HighestLevel;
import com.ims.ims_be.enums.Position;
import com.ims.ims_be.enums.Skill;
import com.ims.ims_be.exception.InvalidInputException;
import com.ims.ims_be.exception.ResourceNotFoundException;
import com.ims.ims_be.mapper.CandidateMapper;
import com.ims.ims_be.repository.CandidateRepository;
import com.ims.ims_be.repository.UserRepository;
import com.ims.ims_be.service.drive.DriveService;
import com.ims.ims_be.service.drive.Res;
import com.ims.ims_be.utils.AppConstants;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final CandidateMapper candidateMapper;
    private final DriveService driveService;

    @Override
    public CandidateListResponse getCandidates(String searchTerm, String status, int pageNumber) {

        // check if status fit enum or not
        CandidateStatus validStatus = validateStatus(status);

        // create pageable with page number and size 10
        Pageable pageable = PageRequest.of(pageNumber, AppConstants.DEFAULT_PAGE_SIZE);

        // Get all suitable candidates
        Page<Candidate> candidatePage = fetchAllCandidates(searchTerm, validStatus, pageable);

        return candidateMapper.candidatesToCandidateListResponse(candidatePage);
    }

    private Page<Candidate> fetchAllCandidates(String searchTerm, CandidateStatus status, Pageable pageable) {
        if (searchTerm != null && !searchTerm.isBlank()) {
            return (status != null)
                    ? candidateRepository.findByFullNameContainingOrEmailContainingOrPhoneNumberContainingAndStatus(searchTerm, status, pageable)
                    : candidateRepository.findByFullNameContainingOrEmailContainingOrPhoneNumberContaining(searchTerm, pageable);
        } else {
            return (status != null)
                    ? candidateRepository.findByStatus(status, pageable)
                    : candidateRepository.findAll(pageable);
        }
    }

    private CandidateStatus validateStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return CandidateStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Status", status);
        }
    }

    @Override
    public Candidate getDefaultCandidateById(Integer id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));
    }

    @Override
    public CandidateDetailDto getCandidateById(Integer id) {
        Candidate candidate = candidateRepository.findByIdWithRecruiter(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));

        User user = userRepository.findById(candidate.getUpdatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "ID", Integer.toString(id)));

        CandidateDetailDto newCandidate = candidateMapper.candidateToDetailDto(candidate);

        newCandidate.setUpdatedBy(user.getAccount().getUsername());
        return newCandidate;
    }

    @Override
    public CandidateRequestDto getEditCandidateById(Integer id) {
        Candidate candidate = candidateRepository.findByIdWithRecruiter(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));

        return candidateMapper.candidateToRequestDto(candidate);
    }

    @Override
    public CandidateDetailDto createCandidate(CandidateRequestDto candidateRequestDto, MultipartFile file) throws IOException, GeneralSecurityException {
        if (file.isEmpty()) {
            throw new InvalidInputException("CV attachment", "Empty File");
        }

        if (candidateRepository.findByEmail(candidateRequestDto.getEmail()) != null) {
            System.out.println("check email");
            throw new InvalidInputException("Email", "This email is already in use");
        }

        // Upload CV file and get URL to DTO
        String cvUrl = uploadCvFile(file);
        candidateRequestDto.setCv(cvUrl);

        // Convert RequestDto to Candidate entity with skills
        Candidate candidate = prepareCandidate(candidateRequestDto);
        candidate.setId(0); // Ensure creating a new entity

        // Save the candidate
        Candidate savedCandidate = candidateRepository.save(candidate);

        // Convert saved Candidate to DetailDto and return
        return candidateMapper.candidateToDetailDto(savedCandidate);
    }

    @Override
    public CandidateDetailDto updateCandidate(Integer id, CandidateRequestDto candidateRequestDto, MultipartFile file) throws IOException, GeneralSecurityException {

        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));

        // Update basic fields
        updateCandidateFields(existingCandidate, candidateRequestDto);


        // Update CV if a new file is provided
        if (file != null && !file.isEmpty()) {
            String cvUrl = uploadCvFile(file);
            existingCandidate.setCv(cvUrl);
        } else {
            existingCandidate.setCv(candidateRequestDto.getCv());
        }

        // Update skills
        updateCandidateSkills(existingCandidate, candidateRequestDto.getSkills());

        // Update recruiter if changed
        int newRecruiterId = candidateRequestDto.getRecruiterId();
        if (!existingCandidate.getRecruiter().getId().equals(newRecruiterId)) {
            User newRecruiter = userRepository.findById(newRecruiterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Recruiter", "ID", Integer.toString(newRecruiterId)));
            existingCandidate.setRecruiter(newRecruiter);
        }

        // Update updated by if changed
        existingCandidate.setUpdatedBy(getUserIdAuthentication());

        // Save the updated candidate
        Candidate updatedCandidate = candidateRepository.save(existingCandidate);

        return candidateMapper.candidateToDetailDto(updatedCandidate);
    }

    private void updateCandidateFields(Candidate candidate, CandidateRequestDto dto) {
        candidate.setFullName(dto.getFullName());
        candidate.setEmail(dto.getEmail());
        candidate.setDob(dto.getDob());
        candidate.setAddress(dto.getAddress());
        candidate.setPhoneNumber(dto.getPhoneNumber());
        candidate.setGender(dto.getGender());
        candidate.setNote(dto.getNote());
        candidate.setPosition(Position.valueOf(dto.getPosition()));
        candidate.setExperience(dto.getExperience());
        candidate.setHighestLevel(HighestLevel.valueOf(dto.getHighestLevel()));
    }

    private void updateCandidateSkills(Candidate candidate, List<String> newSkills) {
        // Remove existing skills
        candidate.getCandidateSkills().clear();

        // Add new skills
        for (String skillName : newSkills) {
            Skill skill = Skill.valueOf(skillName);
            CandidateSkillId candidateSkillId = new CandidateSkillId(candidate.getId(), skill);
            CandidateSkill candidateSkill = new CandidateSkill(candidateSkillId, candidate, skill);
            candidate.addSkill(candidateSkill);
        }
    }


    @Override
    public void deleteCandidate(Integer id) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));
        if (!existingCandidate.getStatus().equals(CandidateStatus.OPEN) && !existingCandidate.getStatus().equals(CandidateStatus.BANNED))
            throw new InvalidInputException("Cannot delete candidate by this status with ID", Integer.toString(id));
        candidateRepository.deleteById(id);
    }

    @Override
    public CandidateDetailDto banCandidate(Integer id) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));
        if (!existingCandidate.getStatus().equals(CandidateStatus.OPEN))
            throw new InvalidInputException("Cannot ban candidate by this status with ID", Integer.toString(id));
        existingCandidate.setStatus(CandidateStatus.BANNED);
        // Save the updated candidate
        Candidate updatedCandidate = candidateRepository.save(existingCandidate);

        return candidateMapper.candidateToDetailDto(updatedCandidate);
    }

    @Override
    public void updateCandidateStatus(Integer id, CandidateStatus status) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "ID", Integer.toString(id)));
        existingCandidate.setStatus(status);
        // Save the updated candidate
        Candidate updatedCandidate = candidateRepository.save(existingCandidate);

        candidateMapper.candidateToDetailDto(updatedCandidate);
    }

    @Override
    public List<CandidateDetailDto> getListCandidateForSchedule() {
        List<CandidateDetailDto> candidateForSchedule = new ArrayList<>();
        List<Candidate> candidates = candidateRepository.findCandidateForSchedule();
        for (Candidate candidate : candidates) {
            CandidateDetailDto candidateDetailDTO = candidateMapper.candidateToDetailDto(candidate);
            candidateForSchedule.add(candidateDetailDTO);
        }
        return candidateForSchedule;
    }

    private String uploadCvFile(MultipartFile file) throws IOException, GeneralSecurityException {
        // Lấy tên gốc và đuôi file của file upload
        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && !originalFileName.matches(".*\\.(pdf|doc|docx|png|jpg)$")) {
            throw new InvalidInputException("CV", "Invalid file format. Only PDF, DOC, DOCX, PNG, and JPG are allowed.");
        }
        String fileExtension = getFileExtension(originalFileName);

        // Tạo file tạm thời với đuôi file gốc
        File tempFile = createTempFile(originalFileName, fileExtension);
        file.transferTo(tempFile);

        // Lấy loại media type của file
        String contentType = file.getContentType();

        // Gọi service để tải file lên Google Drive
        Res res = driveService.uploadFileToDrive(tempFile, contentType, originalFileName);
        return res.getUrl(); // Giả sử rằng `res` chứa URL của file đã tải lên
    }

    private String getFileExtension(String fileName) {
        return fileName != null && fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf("."))
                : "";
    }

    private File createTempFile(String originalFileName, String fileExtension) throws IOException {
        return File.createTempFile(originalFileName.replace(fileExtension, ""), fileExtension);
    }

    private Candidate prepareCandidate(CandidateRequestDto candidateRequestDto) {
        Candidate candidate = candidateMapper.candidateRequestDtoToCandidate(candidateRequestDto);
        candidate.setStatus(CandidateStatus.OPEN);

        // Prepare and add skills
        addCandidateSkills(candidate, candidateRequestDto.getSkills());

        int newRecruiterId = candidateRequestDto.getRecruiterId();
        User recruiter = userRepository.findById(newRecruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter", "ID", Integer.toString(newRecruiterId)));
        candidate.setRecruiter(recruiter);

        candidate.setUpdatedBy(getUserIdAuthentication());

        return candidate;
    }

    private void addCandidateSkills(Candidate candidate, List<String> skills) {
        List<CandidateSkill> candidateSkills = new ArrayList<>();
        for (String skillName : skills) {
            Skill skill = Skill.valueOf(skillName);
            CandidateSkillId candidateSkillId = new CandidateSkillId(candidate.getId(), skill); // Set null for now, will be updated after save
            CandidateSkill candidateSkill = new CandidateSkill(candidateSkillId, candidate, skill);
            candidateSkills.add(candidateSkill);
        }
        candidate.setCandidateSkills(candidateSkills);
    }

    private int getUserIdAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return Integer.parseInt(jwt.getClaimAsString("userId"));
        } else {
            throw new RuntimeException("User is not authenticated");
        }
    }

}
